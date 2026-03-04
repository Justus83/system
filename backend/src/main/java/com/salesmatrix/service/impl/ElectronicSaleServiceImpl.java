package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.PaymentMethod;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ElectronicSaleMapper;
import com.salesmatrix.repository.*;
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
public class ElectronicSaleServiceImpl implements ElectronicSaleService {

    private final ElectronicSaleRepository electronicSaleRepository;
    private final ElectronicSaleMapper electronicSaleMapper;
    private final ElectronicProductRepository electronicProductRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CustomerRepository customerRepository;
    private final ElectronicBrokerRepository electronicBrokerRepository;
    private final ElectronicBrokerTransactionRepository electronicBrokerTransactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ElectronicSaleDTO createSale(ElectronicSaleDTO dto) {
        ElectronicProduct product = electronicProductRepository.findById(dto.getElectronicProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + dto.getElectronicProductId()));

        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));

        Branch branch = null;
        if (dto.getBranchId() != null) {
            branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + dto.getBranchId()));
        }

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + dto.getCustomerId()));

        ElectronicBroker broker = null;
        if (dto.getBrokerId() != null) {
            broker = electronicBrokerRepository.findById(dto.getBrokerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Broker not found with id: " + dto.getBrokerId()));
        }

        ElectronicBrokerTransaction brokerTransaction = null;
        if (dto.getElectronicBrokerTransactionId() != null) {
            brokerTransaction = electronicBrokerTransactionRepository.findById(dto.getElectronicBrokerTransactionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Electronic Broker Transaction not found with id: " + dto.getElectronicBrokerTransactionId()));
        }

        ElectronicSale sale = buildSaleFromDTO(dto, product, store, branch, customer, broker, brokerTransaction);
        ElectronicSale savedSale = electronicSaleRepository.save(sale);
        
        // Update product status to SOLD
        product.setStatus(ProductStatus.SOLD);
        electronicProductRepository.save(product);
        
        return electronicSaleMapper.toDTO(savedSale);
    }

    @Override
    public ElectronicSaleDTO getSaleById(Long id) {
        ElectronicSale sale = electronicSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
        return electronicSaleMapper.toDTO(sale);
    }

    @Override
    public List<ElectronicSaleDTO> getAllSales() {
        List<ElectronicSale> sales = electronicSaleRepository.findAll();
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByStore(Long storeId) {
        List<ElectronicSale> sales = electronicSaleRepository.findByStoreId(storeId);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByBranch(Long branchId) {
        List<ElectronicSale> sales = electronicSaleRepository.findByBranchId(branchId);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByCustomer(Long customerId) {
        List<ElectronicSale> sales = electronicSaleRepository.findByCustomerId(customerId);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByBroker(Long brokerId) {
        List<ElectronicSale> sales = electronicSaleRepository.findByBrokerId(brokerId);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByProduct(Long productId) {
        List<ElectronicSale> sales = electronicSaleRepository.findByProductId(productId);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByPaymentMethod(PaymentMethod paymentMethod) {
        List<ElectronicSale> sales = electronicSaleRepository.findByPaymentMethod(paymentMethod);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<ElectronicSale> sales = electronicSaleRepository.findBySaleDateBetween(startDate, endDate);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByStoreAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate) {
        List<ElectronicSale> sales = electronicSaleRepository.findByStoreIdAndSaleDateBetween(storeId, startDate, endDate);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    public List<ElectronicSaleDTO> getSalesByBranchAndDateRange(Long branchId, LocalDateTime startDate, LocalDateTime endDate) {
        List<ElectronicSale> sales = electronicSaleRepository.findByBranchIdAndSaleDateBetween(branchId, startDate, endDate);
        return electronicSaleMapper.toDTOList(sales);
    }

    @Override
    @Transactional
    public ElectronicSaleDTO updateSale(Long id, ElectronicSaleDTO dto) {
        ElectronicSale sale = electronicSaleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));

        ElectronicProduct product = electronicProductRepository.findById(dto.getElectronicProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + dto.getElectronicProductId()));

        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + dto.getStoreId()));

        Branch branch = null;
        if (dto.getBranchId() != null) {
            branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + dto.getBranchId()));
        }

        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + dto.getCustomerId()));

        ElectronicBroker broker = null;
        if (dto.getBrokerId() != null) {
            broker = electronicBrokerRepository.findById(dto.getBrokerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Broker not found with id: " + dto.getBrokerId()));
        }

        ElectronicBrokerTransaction brokerTransaction = null;
        if (dto.getElectronicBrokerTransactionId() != null) {
            brokerTransaction = electronicBrokerTransactionRepository.findById(dto.getElectronicBrokerTransactionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Electronic Broker Transaction not found with id: " + dto.getElectronicBrokerTransactionId()));
        }

        // Calculate totalAmount from salePrice and quantity
        BigDecimal salePrice = dto.getSalePrice() != null ? dto.getSalePrice() : BigDecimal.ZERO;
        int quantity = dto.getQuantity() != null ? dto.getQuantity() : 1;
        BigDecimal totalAmount = salePrice.multiply(BigDecimal.valueOf(quantity));
        
        // Calculate balance due: totalAmount - amountPaid
        BigDecimal amountPaid = dto.getAmountPaid() != null ? dto.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal balanceDue = totalAmount.subtract(amountPaid);
        
        // Calculate profit/loss
        BigDecimal costPriceAtSale = dto.getCostPriceAtSale() != null ? dto.getCostPriceAtSale() : 
            (product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO);
        ProfitLossResult profitLoss = calculateProfitLoss(salePrice, costPriceAtSale, quantity);
        
        // Update the sale entity with calculated values
        sale.setProduct(product);
        sale.setStore(store);
        sale.setBranch(branch);
        sale.setCustomer(customer);
        sale.setBroker(broker);
        sale.setElectronicBrokerTransaction(brokerTransaction);
        sale.setCostPriceAtSale(costPriceAtSale);
        sale.setSalePrice(salePrice);
        sale.setQuantity(quantity);
        sale.setTotalAmount(totalAmount);
        sale.setProfit(profitLoss.profit);
        sale.setLoss(profitLoss.loss);
        sale.setIsCreditSale(dto.getIsCreditSale() != null ? dto.getIsCreditSale() : false);
        sale.setCreditAmount(dto.getCreditAmount() != null ? dto.getCreditAmount() : totalAmount);
        sale.setAmountPaid(amountPaid);
        sale.setBalanceDue(balanceDue);
        sale.setPaymentMethod(dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null);
        
        ElectronicSale updatedSale = electronicSaleRepository.save(sale);
        return electronicSaleMapper.toDTO(updatedSale);
    }

@Override
@Transactional
public void deleteSale(Long id) {
    ElectronicSale sale = electronicSaleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
    
    // Get the product before deleting the sale
    ElectronicProduct product = sale.getProduct();
    
    // Delete the sale
    electronicSaleRepository.deleteById(id);
    
    // Check if there are any remaining sales for this product
    List<ElectronicSale> remainingSales = electronicSaleRepository.findByProductId(product.getId());
    
    // If no other sales exist, revert the product status to AVAILABLE
    if (remainingSales.isEmpty()) {
        product.setStatus(ProductStatus.AVAILABLE);
        electronicProductRepository.save(product);
    }
}

    @Override
    @Transactional
    public ElectronicSaleDTO createSaleFromBrokerTransaction(Long brokerTransactionId, Long customerId, PaymentMethod paymentMethod) {
        ElectronicBrokerTransaction brokerTransaction = electronicBrokerTransactionRepository.findById(brokerTransactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Broker transaction not found with id: " + brokerTransactionId));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        ElectronicProduct product = brokerTransaction.getElectronicProduct();
        Store store = brokerTransaction.getStore();
        Branch branch = brokerTransaction.getBranch();
        ElectronicBroker broker = brokerTransaction.getBroker();

        // For broker transactions, sale price must be provided - default to zero if not available
        BigDecimal salePrice = BigDecimal.ZERO;
        BigDecimal costPriceAtSale = product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO;
        int quantity = 1;

        ProfitLossResult profitLoss = calculateProfitLoss(salePrice, costPriceAtSale, quantity);

        // Get the current logged-in user
        User createdBy = getCurrentUser();

        ElectronicSale sale = ElectronicSale.builder()
                .product(product)
                .store(store)
                .branch(branch)
                .customer(customer)
                .broker(broker)
                .electronicBrokerTransaction(brokerTransaction)
                .costPriceAtSale(costPriceAtSale)
                .salePrice(salePrice)
                .quantity(quantity)
                .totalAmount(salePrice)
                .profit(profitLoss.profit)
                .loss(profitLoss.loss)
                .isCreditSale(false)
                .amountPaid(salePrice)
                .balanceDue(BigDecimal.ZERO)
                .paymentMethod(paymentMethod)
                .createdBy(createdBy)
                .build();

        ElectronicSale savedSale = electronicSaleRepository.save(sale);
        
        // Update product status to SOLD
        product.setStatus(ProductStatus.SOLD);
        electronicProductRepository.save(product);
        
        return electronicSaleMapper.toDTO(savedSale);
    }

    /**
     * Builds an ElectronicSale entity from DTO with calculated profit/loss and credit tracking.
     */
    private ElectronicSale buildSaleFromDTO(ElectronicSaleDTO dto, ElectronicProduct product, Store store,
                                            Branch branch, Customer customer, ElectronicBroker broker,
                                            ElectronicBrokerTransaction brokerTransaction) {
        // Use costPriceAtSale from DTO if provided, otherwise get from product
        BigDecimal costPriceAtSale;
        if (dto.getCostPriceAtSale() != null) {
            costPriceAtSale = dto.getCostPriceAtSale();
        } else {
            costPriceAtSale = product.getCostPrice() != null ? product.getCostPrice() : BigDecimal.ZERO;
        }
        int quantity = dto.getQuantity() != null ? dto.getQuantity() : 1;
        BigDecimal salePrice = dto.getSalePrice() != null ? dto.getSalePrice() : BigDecimal.ZERO;
        BigDecimal totalAmount = salePrice.multiply(BigDecimal.valueOf(quantity));

        ProfitLossResult profitLoss = calculateProfitLoss(salePrice, costPriceAtSale, quantity);
        CreditTracking creditTracking = calculateCreditTracking(dto, totalAmount);

        // Get the current logged-in user
        User createdBy = getCurrentUser();

        return ElectronicSale.builder()
                .product(product)
                .store(store)
                .branch(branch)
                .customer(customer)
                .broker(broker)
                .electronicBrokerTransaction(brokerTransaction)
                .costPriceAtSale(costPriceAtSale)
                .salePrice(salePrice)
                .quantity(quantity)
                .totalAmount(totalAmount)
                .profit(profitLoss.profit)
                .loss(profitLoss.loss)
                .isCreditSale(creditTracking.isCreditSale)
                .creditAmount(creditTracking.creditAmount)
                .amountPaid(creditTracking.amountPaid)
                .balanceDue(creditTracking.balanceDue)
                .paymentMethod(dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null)
                .createdBy(createdBy)
                .build();
    }

    /**
     * Gets the currently authenticated user from SecurityContextHolder.
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName())
                    .orElse(null);
        }
        return null;
    }

    /**
     * Calculates profit or loss based on sale price vs cost price.
     */
    private ProfitLossResult calculateProfitLoss(BigDecimal salePrice, BigDecimal costPriceAtSale, int quantity) {
        BigDecimal priceDifference = salePrice.subtract(costPriceAtSale);
        BigDecimal totalProfitOrLoss = priceDifference.multiply(BigDecimal.valueOf(quantity));

        BigDecimal profit = null;
        BigDecimal loss = null;

        if (priceDifference.compareTo(BigDecimal.ZERO) > 0) {
            profit = totalProfitOrLoss;
        } else if (priceDifference.compareTo(BigDecimal.ZERO) < 0) {
            loss = totalProfitOrLoss.abs();
        }

        return new ProfitLossResult(profit, loss);
    }

    /**
     * Calculates credit tracking details for a sale.
     */
    private CreditTracking calculateCreditTracking(ElectronicSaleDTO dto, BigDecimal totalAmount) {
        Boolean isCreditSale = dto.getIsCreditSale() != null ? dto.getIsCreditSale() : false;
        BigDecimal amountPaid = dto.getAmountPaid() != null ? dto.getAmountPaid() : BigDecimal.ZERO;
        
        // Use creditAmount if provided, otherwise use totalAmount as the full amount owed
        BigDecimal creditAmount = dto.getCreditAmount() != null ? dto.getCreditAmount() : totalAmount;
        
        // Calculate balance due as creditAmount - amountPaid (works for both credit and non-credit sales)
        BigDecimal balanceDue = creditAmount.subtract(amountPaid);

        return new CreditTracking(isCreditSale, creditAmount, amountPaid, balanceDue);
    }

    @Override
    public List<ElectronicProduct> getAvailableElectronicProducts() {
        return electronicProductRepository.findByStatus(ProductStatus.AVAILABLE);
    }

    /**
     * Helper class to hold profit/loss calculation results.
     */
    private static class ProfitLossResult {
        final BigDecimal profit;
        final BigDecimal loss;

        ProfitLossResult(BigDecimal profit, BigDecimal loss) {
            this.profit = profit;
            this.loss = loss;
        }
    }

    /**
     * Helper class to hold credit tracking details.
     */
    private static class CreditTracking {
        final Boolean isCreditSale;
        final BigDecimal creditAmount;
        final BigDecimal amountPaid;
        final BigDecimal balanceDue;

        CreditTracking(Boolean isCreditSale, BigDecimal creditAmount, BigDecimal amountPaid, BigDecimal balanceDue) {
            this.isCreditSale = isCreditSale;
            this.creditAmount = creditAmount;
            this.amountPaid = amountPaid;
            this.balanceDue = balanceDue;
        }
    }
}
