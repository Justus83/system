package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ElectronicBrokerTransactionDTO;
import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.BrokerTransactionStatus;
import com.salesmatrix.enums.PaymentMethod;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.exception.ResourceNotFoundException;

import com.salesmatrix.mapper.ElectronicBrokerTransactionMapper;
import com.salesmatrix.mapper.ElectronicSaleMapper;
import com.salesmatrix.repository.*;
import com.salesmatrix.service.ElectronicBrokerTransactionService;
import com.salesmatrix.service.ElectronicSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ElectronicBrokerTransactionServiceImpl implements ElectronicBrokerTransactionService {

    private final ElectronicBrokerTransactionRepository brokerTransactionRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final ElectronicProductRepository electronicProductRepository;
    private final ElectronicBrokerRepository electronicBrokerRepository;
    private final CustomerRepository customerRepository;
    private final ElectronicSaleRepository electronicSaleRepository;
    private final ElectronicBrokerTransactionMapper electronicBrokerTransactionMapper;
    private final ElectronicSaleMapper electronicSaleMapper;
    private final ElectronicSaleService electronicSaleService;

    @Override
    public ElectronicBrokerTransactionDTO createTransaction(ElectronicBrokerTransactionDTO dto) {
        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));

        Branch branch = null;
        if (dto.getBranchId() != null) {
            branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + dto.getBranchId()));
        }

        ElectronicProduct electronicProduct = electronicProductRepository.findById(dto.getElectronicProductId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found with id: " + dto.getElectronicProductId()));

        ElectronicBroker broker = electronicBrokerRepository.findById(dto.getBrokerId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicBroker not found with id: " + dto.getBrokerId()));

        ElectronicBrokerTransaction transaction = electronicBrokerTransactionMapper.toEntity(dto, store, branch, electronicProduct, broker);
        
        // Set takenAt timestamp if status is TAKEN and takenAt is null
        if (transaction.getStatus() == BrokerTransactionStatus.TAKEN && transaction.getTakenAt() == null) {
            transaction.setTakenAt(LocalDateTime.now());
        }

        // Update product status based on transaction status
        updateProductStatus(electronicProduct, transaction.getStatus());

        ElectronicBrokerTransaction savedTransaction = brokerTransactionRepository.save(transaction);
        
        // If status is SOLD, create a sale record automatically
        if (transaction.getStatus() == BrokerTransactionStatus.SOLD) {
            PaymentMethod paymentMethod = dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null;
            createSaleForBrokerTransaction(savedTransaction, broker, dto.getSellingPrice(), dto.getAmountPaid(), paymentMethod);
        }
        
        return electronicBrokerTransactionMapper.toDTO(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public ElectronicBrokerTransactionDTO getTransactionById(Long id) {
        ElectronicBrokerTransaction transaction = brokerTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BrokerTransaction not found with id: " + id));
        return electronicBrokerTransactionMapper.toDTO(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getAllTransactions() {
        return brokerTransactionRepository.findAll()
                .stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getTransactionsByStore(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        
        List<ElectronicBrokerTransaction> transactions = brokerTransactionRepository.findByStoreWithProduct(store);
        
        // Initialize lazy-loaded properties for each product
        for (ElectronicBrokerTransaction transaction : transactions) {
            ElectronicProduct product = transaction.getElectronicProduct();
            if (product != null) {
                // Force initialization of lazy-loaded properties based on product type
                if (product instanceof Smartphone) {
                    Smartphone smartphone = (Smartphone) product;
                    org.hibernate.Hibernate.initialize(smartphone.getColor());
                    org.hibernate.Hibernate.initialize(smartphone.getStorageSize());
                    org.hibernate.Hibernate.initialize(smartphone.getRamSize());
                } else if (product instanceof Laptop) {
                    Laptop laptop = (Laptop) product;
                    org.hibernate.Hibernate.initialize(laptop.getColor());
                    org.hibernate.Hibernate.initialize(laptop.getStorageSize());
                    org.hibernate.Hibernate.initialize(laptop.getRamSize());
                } else if (product instanceof Tablet) {
                    Tablet tablet = (Tablet) product;
                    org.hibernate.Hibernate.initialize(tablet.getColor());
                    org.hibernate.Hibernate.initialize(tablet.getStorageSize());
                    org.hibernate.Hibernate.initialize(tablet.getRamSize());
                } else if (product instanceof Smartwatch) {
                    Smartwatch smartwatch = (Smartwatch) product;
                    org.hibernate.Hibernate.initialize(smartwatch.getColor());
                } else if (product instanceof TV) {
                    TV tv = (TV) product;
                    org.hibernate.Hibernate.initialize(tv.getColor());
                }
            }
        }
        
        return transactions.stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getTransactionsByBranch(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + branchId));
        return brokerTransactionRepository.findByBranch(branch)
                .stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getTransactionsByBroker(Long brokerId) {
        ElectronicBroker broker = electronicBrokerRepository.findById(brokerId)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicBroker not found with id: " + brokerId));
        return brokerTransactionRepository.findByBroker(broker)
                .stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getTransactionsByProduct(Long productId) {
        ElectronicProduct product = electronicProductRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found with id: " + productId));
        return brokerTransactionRepository.findByElectronicProduct(product)
                .stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerTransactionDTO> getTransactionsByStatus(BrokerTransactionStatus status) {
        return brokerTransactionRepository.findByStatus(status)
                .stream()
                .map(electronicBrokerTransactionMapper::toDTO)
                .toList();
    }

    @Override
    public ElectronicBrokerTransactionDTO updateTransaction(Long id, ElectronicBrokerTransactionDTO dto) {
        ElectronicBrokerTransaction transaction = brokerTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BrokerTransaction not found with id: " + id));

        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));

        Branch branch = null;
        if (dto.getBranchId() != null) {
            branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + dto.getBranchId()));
        }

        ElectronicProduct newProduct = electronicProductRepository.findById(dto.getElectronicProductId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found with id: " + dto.getElectronicProductId()));

        ElectronicBroker broker = electronicBrokerRepository.findById(dto.getBrokerId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicBroker not found with id: " + dto.getBrokerId()));

        // Check if product has changed
        ElectronicProduct oldProduct = transaction.getElectronicProduct();
        boolean productChanged = !oldProduct.getId().equals(newProduct.getId());
        
        // If product changed, restore old product to AVAILABLE
        if (productChanged) {
            oldProduct.setStatus(ProductStatus.AVAILABLE);
            electronicProductRepository.save(oldProduct);
        }

        electronicBrokerTransactionMapper.updateEntity(transaction, dto, store, branch, newProduct, broker);
        
        // Check if status changed to SOLD
        BrokerTransactionStatus oldStatus = transaction.getStatus();
        BrokerTransactionStatus newStatus = BrokerTransactionStatus.valueOf(dto.getStatus());
        boolean statusChangedToSold = oldStatus != BrokerTransactionStatus.SOLD && newStatus == BrokerTransactionStatus.SOLD;
        
        // Update new product status based on transaction status
        updateProductStatus(newProduct, transaction.getStatus());
        
        ElectronicBrokerTransaction updatedTransaction = brokerTransactionRepository.save(transaction);
        
        // If status changed to SOLD, create a sale record
        if (statusChangedToSold) {
            PaymentMethod paymentMethod = dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null;
            createSaleForBrokerTransaction(updatedTransaction, broker, dto.getSellingPrice(), dto.getAmountPaid(), paymentMethod);
        }
        
        return electronicBrokerTransactionMapper.toDTO(updatedTransaction);
    }

    @Override
    public ElectronicBrokerTransactionDTO updateTransactionStatus(Long id, BrokerTransactionStatus status) {
       ElectronicBrokerTransaction transaction = brokerTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BrokerTransaction not found with id: " + id));

        transaction.setStatus(status);

        // Update timestamps based on status
        if (status == BrokerTransactionStatus.TAKEN && transaction.getTakenAt() == null) {
            transaction.setTakenAt(LocalDateTime.now());
        } else if (status == BrokerTransactionStatus.RETURNED && transaction.getReturnedAt() == null) {
            transaction.setReturnedAt(LocalDateTime.now());
        } else if (status == BrokerTransactionStatus.SOLD && transaction.getSoldAt() == null) {
            transaction.setSoldAt(LocalDateTime.now());
        }

        // Update product status based on transaction status
        updateProductStatus(transaction.getElectronicProduct(), status);

        ElectronicBrokerTransaction updatedTransaction = brokerTransactionRepository.save(transaction);
        return electronicBrokerTransactionMapper.toDTO(updatedTransaction);
    }

    @Override
    public void deleteTransaction(Long id) {
        ElectronicBrokerTransaction transaction = brokerTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BrokerTransaction not found with id: " + id));
        
        // Restore product status to AVAILABLE when deleting a transaction
        ElectronicProduct product = transaction.getElectronicProduct();
        if (product.getStatus() == ProductStatus.TAKEN) {
            product.setStatus(ProductStatus.AVAILABLE);
            electronicProductRepository.save(product);
        }
        
        brokerTransactionRepository.deleteById(id);
    }

    /**
     * Helper method to update product status based on broker transaction status
     */
    private void updateProductStatus(ElectronicProduct product, BrokerTransactionStatus transactionStatus) {
        switch (transactionStatus) {
            case TAKEN:
                product.setStatus(ProductStatus.TAKEN);
                break;
            case RETURNED:
                product.setStatus(ProductStatus.AVAILABLE);
                break;
            case SOLD:
                product.setStatus(ProductStatus.SOLD);
                break;
        }
        electronicProductRepository.save(product);
    }

    @Override
    public ElectronicSaleDTO markAsSold(Long id, Long customerId, PaymentMethod paymentMethod) {
       ElectronicBrokerTransaction transaction = brokerTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BrokerTransaction not found with id: " + id));

        // Update the transaction status to SOLD
        transaction.setStatus(BrokerTransactionStatus.SOLD);
        if (transaction.getSoldAt() == null) {
            transaction.setSoldAt(LocalDateTime.now());
        }
        brokerTransactionRepository.save(transaction);

        // Create ElectronicSale from the broker transaction
        return electronicSaleService.createSaleFromBrokerTransaction(
                id,
                customerId,
                paymentMethod
        );
    }
    
    /**
     * Helper method to create a sale record for a broker transaction
     * Creates or finds a customer using broker information
     */
    private void createSaleForBrokerTransaction(ElectronicBrokerTransaction transaction, ElectronicBroker broker, 
                                                BigDecimal sellingPrice, BigDecimal amountPaid, PaymentMethod paymentMethod) {
        // Find or create a customer using broker information
        Customer customer = customerRepository.findByPhoneNumberAndStoreId(broker.getPhoneNumber(), transaction.getStore().getId())
                .orElseGet(() -> {
                    Customer newCustomer = Customer.builder()
                            .name(broker.getName())
                            .phoneNumber(broker.getPhoneNumber())
                            .store(transaction.getStore())
                            .build();
                    return customerRepository.save(newCustomer);
                });
        
        // Get the current logged-in user
        User createdBy = getCurrentUser();
        
        ElectronicProduct product = transaction.getElectronicProduct();
        BigDecimal costPriceAtSale = product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO;
        
        // Use provided selling price or default to cost price
        BigDecimal salePrice = sellingPrice != null ? sellingPrice : costPriceAtSale;
        BigDecimal paidAmount = amountPaid != null ? amountPaid : salePrice;
        BigDecimal balanceDue = salePrice.subtract(paidAmount);
        
        // Calculate profit/loss
        BigDecimal profitLoss = salePrice.subtract(costPriceAtSale);
        BigDecimal profit = profitLoss.compareTo(BigDecimal.ZERO) > 0 ? profitLoss : BigDecimal.ZERO;
        BigDecimal loss = profitLoss.compareTo(BigDecimal.ZERO) < 0 ? profitLoss.abs() : BigDecimal.ZERO;
        
        // Determine if it's a credit sale
        boolean isCreditSale = balanceDue.compareTo(BigDecimal.ZERO) > 0;
        
        // Create the sale record
        ElectronicSale sale = ElectronicSale.builder()
                .product(product)
                .store(transaction.getStore())
                .branch(transaction.getBranch())
                .customer(customer)
                .broker(broker)
                .electronicBrokerTransaction(transaction)
                .costPriceAtSale(costPriceAtSale)
                .salePrice(salePrice)
                .quantity(1)
                .totalAmount(salePrice)
                .profit(profit)
                .loss(loss)
                .isCreditSale(isCreditSale)
                .creditAmount(isCreditSale ? balanceDue : BigDecimal.ZERO)
                .amountPaid(paidAmount)
                .balanceDue(balanceDue)
                .paymentMethod(paymentMethod != null ? paymentMethod : PaymentMethod.CASH)
                .createdBy(createdBy)
                .build();
        
        electronicSaleRepository.save(sale);
    }
    
    /**
     * Get the current logged-in user
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        return null;
    }
}
