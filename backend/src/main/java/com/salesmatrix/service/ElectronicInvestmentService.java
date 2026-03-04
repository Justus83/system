package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicInvestmentDTO;
import com.salesmatrix.entity.ElectronicInvestment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ElectronicInvestmentMapper;
import com.salesmatrix.repository.ElectronicInvestmentRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElectronicInvestmentService {

    private final ElectronicInvestmentRepository electronicInvestmentRepository;
    private final SupplierRepository supplierRepository;
    private final StoreRepository storeRepository;
    private final ElectronicInvestmentMapper electronicInvestmentMapper;

    @Transactional
    public ElectronicInvestmentDTO createInvestment(ElectronicInvestmentDTO investmentDTO) {
        // Validate supplier if provided
        Supplier supplier = null;
        if (investmentDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(investmentDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + investmentDTO.getSupplierId()));
        }

        // Validate store if provided
        Store store = null;
        if (investmentDTO.getStoreId() != null) {
            store = storeRepository.findById(investmentDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + investmentDTO.getStoreId()));
        }

        // Generate invoice number if not provided
        if (investmentDTO.getInvoiceNumber() == null || investmentDTO.getInvoiceNumber().isEmpty()) {
            investmentDTO.setInvoiceNumber(generateInvoiceNumber());
        }

        // Set default date if not provided
        if (investmentDTO.getInvestmentDate() == null) {
            investmentDTO.setInvestmentDate(LocalDateTime.now());
        }

        // Calculate balance
        BigDecimal totalAmount = investmentDTO.getTotalAmount() != null ? investmentDTO.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal amountPaid = investmentDTO.getAmountPaid() != null ? investmentDTO.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal balance = totalAmount.subtract(amountPaid);
        investmentDTO.setBalance(balance);

        // Set default status
        if (investmentDTO.getStatus() == null) {
            investmentDTO.setStatus("active");
        }

        // Calculate items remaining
        Integer totalItems = investmentDTO.getTotalItems() != null ? investmentDTO.getTotalItems() : 0;
        Integer itemsReceived = investmentDTO.getItemsReceived() != null ? investmentDTO.getItemsReceived() : 0;
        investmentDTO.setItemsRemaining(totalItems - itemsReceived);

        ElectronicInvestment investment = electronicInvestmentMapper.toEntity(investmentDTO, supplier, store);
        ElectronicInvestment savedInvestment = electronicInvestmentRepository.save(investment);

        return electronicInvestmentMapper.toDTO(savedInvestment);
    }

    @Transactional(readOnly = true)
    public ElectronicInvestmentDTO getInvestmentById(Long id) {
        ElectronicInvestment investment = electronicInvestmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));
        return electronicInvestmentMapper.toDTO(investment);
    }

    @Transactional(readOnly = true)
    public List<ElectronicInvestmentDTO> getAllInvestments() {
        return electronicInvestmentRepository.findAll().stream()
                .map(electronicInvestmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicInvestmentDTO> getInvestmentsByStoreId(Long storeId) {
        return electronicInvestmentRepository.findByStoreId(storeId).stream()
                .map(electronicInvestmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicInvestmentDTO> getInvestmentsByStatus(ElectronicInvestment.ElectronicInvestmentStatus status) {
        return electronicInvestmentRepository.findByStatus(status).stream()
                .map(electronicInvestmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicInvestmentDTO> getInvestmentsByStoreIdAndStatus(Long storeId, ElectronicInvestment.ElectronicInvestmentStatus status) {
        return electronicInvestmentRepository.findByStoreIdAndStatus(storeId, status).stream()
                .map(electronicInvestmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicInvestmentDTO> getInvestmentsBySupplierId(Long supplierId) {
        return electronicInvestmentRepository.findBySupplierId(supplierId).stream()
                .map(electronicInvestmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ElectronicInvestmentDTO getInvestmentByInvoiceNumber(String invoiceNumber) {
        ElectronicInvestment investment = electronicInvestmentRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with invoice number: " + invoiceNumber));
        return electronicInvestmentMapper.toDTO(investment);
    }

    @Transactional
    public ElectronicInvestmentDTO updateInvestment(Long id, ElectronicInvestmentDTO investmentDTO) {
        ElectronicInvestment existingInvestment = electronicInvestmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + id));

        // Update supplier if provided
        if (investmentDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(investmentDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + investmentDTO.getSupplierId()));
            existingInvestment.setSupplier(supplier);
        }

        // Update store if provided
        if (investmentDTO.getStoreId() != null) {
            Store store = storeRepository.findById(investmentDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + investmentDTO.getStoreId()));
            existingInvestment.setStore(store);
        }

        // Update other fields
        if (investmentDTO.getInvoiceNumber() != null) {
            existingInvestment.setInvoiceNumber(investmentDTO.getInvoiceNumber());
        }
        if (investmentDTO.getProductDetails() != null) {
            existingInvestment.setProductDetails(investmentDTO.getProductDetails());
        }
        if (investmentDTO.getInvestmentDate() != null) {
            existingInvestment.setInvestmentDate(investmentDTO.getInvestmentDate());
        }
        if (investmentDTO.getTotalItems() != null) {
            existingInvestment.setTotalItems(investmentDTO.getTotalItems());
        }
        if (investmentDTO.getTotalAmount() != null) {
            existingInvestment.setTotalAmount(investmentDTO.getTotalAmount());
        }
        if (investmentDTO.getAmountPaid() != null) {
            existingInvestment.setAmountPaid(investmentDTO.getAmountPaid());
        }
        if (investmentDTO.getProductCondition() != null) {
            existingInvestment.setProductCondition(ElectronicInvestment.ProductCondition.valueOf(investmentDTO.getProductCondition().toUpperCase()));
        }
        if (investmentDTO.getStatus() != null) {
            existingInvestment.setStatus(ElectronicInvestment.ElectronicInvestmentStatus.valueOf(investmentDTO.getStatus().toUpperCase()));
        }
        if (investmentDTO.getNotes() != null) {
            existingInvestment.setNotes(investmentDTO.getNotes());
        }
        if (investmentDTO.getTotalQuantity() != null) {
            existingInvestment.setTotalQuantity(investmentDTO.getTotalQuantity());
        }
        if (investmentDTO.getItemsReceived() != null) {
            existingInvestment.setItemsReceived(investmentDTO.getItemsReceived());
        }
        if (investmentDTO.getCreatedBy() != null) {
            existingInvestment.setCreatedBy(investmentDTO.getCreatedBy());
        }

        // Recalculate balance
        BigDecimal balance = existingInvestment.getTotalAmount().subtract(existingInvestment.getAmountPaid());
        existingInvestment.setBalance(balance);

        // Recalculate items remaining
        existingInvestment.setItemsRemaining(existingInvestment.getTotalItems() - existingInvestment.getItemsReceived());

        ElectronicInvestment updatedInvestment = electronicInvestmentRepository.save(existingInvestment);
        return electronicInvestmentMapper.toDTO(updatedInvestment);
    }

    @Transactional
    public ElectronicInvestmentDTO addPayment(Long investmentId, BigDecimal amount, String paymentMethod) {
        ElectronicInvestment investment = electronicInvestmentRepository.findById(investmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Investment not found with id: " + investmentId));

        BigDecimal newAmountPaid = investment.getAmountPaid().add(amount);
        investment.setAmountPaid(newAmountPaid);

        BigDecimal balance = investment.getTotalAmount().subtract(newAmountPaid);
        investment.setBalance(balance);

        // Update status if fully paid
        if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            investment.setStatus(ElectronicInvestment.ElectronicInvestmentStatus.COMPLETED);
        }

        ElectronicInvestment updatedInvestment = electronicInvestmentRepository.save(investment);
        return electronicInvestmentMapper.toDTO(updatedInvestment);
    }

    @Transactional
    public void deleteInvestment(Long id) {
        if (!electronicInvestmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Investment not found with id: " + id);
        }
        electronicInvestmentRepository.deleteById(id);
    }

    private String generateInvoiceNumber() {
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(5);
        return "INV-" + timestamp;
    }
}

