package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ElectronicSupplierReturnDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.entity.ElectronicSupplierReturn;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ElectronicSupplierReturnMapper;
import com.salesmatrix.repository.ElectronicProductRepository;
import com.salesmatrix.repository.ElectronicSupplierReturnRepository;
import com.salesmatrix.service.ElectronicSupplierReturnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ElectronicSupplierReturnServiceImpl implements ElectronicSupplierReturnService {

    private final ElectronicSupplierReturnRepository electronicSupplierReturnRepository;
    private final ElectronicSupplierReturnMapper electronicSupplierReturnMapper;
    private final ElectronicProductRepository electronicProductRepository;

    @Override
    public ElectronicSupplierReturnDTO createElectronicSupplierReturn(ElectronicSupplierReturnDTO dto) {
        log.info("Creating supplier return for product ID: {}", dto.getElectronicProductId());

        // Validate product exists
        ElectronicProduct product = electronicProductRepository.findById(dto.getElectronicProductId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found with id: " + dto.getElectronicProductId()));

        // Determine the source based on product's sourceType and available data
        if (product.getSourceType() == com.salesmatrix.enums.SourceType.SUPPLIER) {
            // For SUPPLIER source type, try to use the supplier
            if (product.getSupplier() != null) {
                dto.setSupplierId(product.getSupplier().getId());
                log.info("Product ID: {} has SUPPLIER source type with supplier ID: {}", 
                         product.getId(), product.getSupplier().getId());
            } else {
                // No supplier assigned, but check if there's other source data we can use
                if (product.getOtherSourceName() != null && !product.getOtherSourceName().trim().isEmpty()) {
                    log.info("Product ID: {} has SUPPLIER source type but no supplier. Using other source data: {}", 
                             product.getId(), product.getOtherSourceName());
                    dto.setSupplierId(null);
                } else {
                    throw new IllegalStateException(
                        "Product has SUPPLIER source type but neither supplier nor other source information is available. " +
                        "Please update the product with either a supplier or other source details."
                    );
                }
            }
        } else if (product.getSourceType() == com.salesmatrix.enums.SourceType.OTHER) {
            // For OTHER source type, use other source data
            if (product.getOtherSourceName() == null || product.getOtherSourceName().trim().isEmpty()) {
                throw new IllegalStateException(
                    "Product has OTHER source type but no other source name is provided. " +
                    "Please update the product with source details."
                );
            }
            dto.setSupplierId(null);
            log.info("Product ID: {} has OTHER source type ({}), creating return without supplier", 
                     product.getId(), product.getOtherSourceName());
        }

        // Check if there's already a pending return for this product
        if (dto.getStatus() != null && 
            (dto.getStatus().equals(ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER.name()) ||
             dto.getStatus().equals(ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER_REPLACED.name()))) {
            if (electronicSupplierReturnRepository.existsByElectronicProductIdAndStatus(
                    dto.getElectronicProductId(), ElectronicSupplierReturnStatus.valueOf(dto.getStatus()))) {
                throw new IllegalStateException("A return with this status already exists for this product");
            }
        }

        ElectronicSupplierReturn entity = electronicSupplierReturnMapper.toEntity(dto);
        
        // Set return date if not provided
        if (entity.getReturnDate() == null) {
            entity.setReturnDate(LocalDateTime.now());
        }

        // Set default status if not provided
        if (entity.getStatus() == null) {
            entity.setStatus(ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER);
        }

        // Set product value from product's cost price if not provided
        if (entity.getProductValue() == null && product.getCostPrice() != null) {
            entity.setProductValue(product.getCostPrice());
        }

        // Update product status based on return status
        updateProductStatusBasedOnReturn(product, entity.getStatus());

        ElectronicSupplierReturn saved = electronicSupplierReturnRepository.save(entity);
        log.info("Supplier return created successfully with ID: {}", saved.getId());
        
        return electronicSupplierReturnMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ElectronicSupplierReturnDTO getElectronicSupplierReturnById(Long id) {
        ElectronicSupplierReturn electronicSupplierReturn = electronicSupplierReturnRepository.findByIdWithSupplierAndProduct(id);
        if (electronicSupplierReturn == null) {
            throw new ResourceNotFoundException("ElectronicSupplierReturn not found with id: " + id);
        }
        return electronicSupplierReturnMapper.toDTO(electronicSupplierReturn);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getAllElectronicSupplierReturns() {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findAllWithSupplierAndProduct();
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierId(Long supplierId) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findBySupplierId(supplierId);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByProductId(Long productId) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findByElectronicProductId(productId);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByStatus(ElectronicSupplierReturnStatus status) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findByStatus(status);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierIdAndStatus(Long supplierId, ElectronicSupplierReturnStatus status) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findBySupplierIdAndStatus(supplierId, status);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findByReturnDateBetween(startDate, endDate);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierIdAndDateRange(Long supplierId, LocalDateTime startDate, LocalDateTime endDate) {
        List<ElectronicSupplierReturn> returns = electronicSupplierReturnRepository.findBySupplierIdAndReturnDateBetween(supplierId, startDate, endDate);
        return electronicSupplierReturnMapper.toDTOList(returns);
    }

    @Override
    public ElectronicSupplierReturnDTO updateElectronicSupplierReturn(Long id, ElectronicSupplierReturnDTO dto) {
        log.info("Updating supplier return with ID: {}", id);

        ElectronicSupplierReturn existing = electronicSupplierReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicSupplierReturn not found with id: " + id));

        // Store old status
        ElectronicSupplierReturnStatus oldStatus = existing.getStatus();

        // Update entity
        electronicSupplierReturnMapper.updateEntityFromDTO(dto, existing);

        // If status changed, update product status
        if (dto.getStatus() != null && !oldStatus.name().equals(dto.getStatus())) {
            ElectronicProduct product = electronicProductRepository.findById(existing.getElectronicProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found"));
            updateProductStatusBasedOnReturn(product, ElectronicSupplierReturnStatus.valueOf(dto.getStatus()));
        }

        ElectronicSupplierReturn updated = electronicSupplierReturnRepository.save(existing);
        log.info("Supplier return updated successfully with ID: {}", updated.getId());
        
        return electronicSupplierReturnMapper.toDTO(updated);
    }

    @Override
    public ElectronicSupplierReturnDTO processReplacement(Long returnId, String replacementSerialNumber, String replacementReason) {
        log.info("Processing replacement for supplier return ID: {} with replacement serial: {}", returnId, replacementSerialNumber);

        ElectronicSupplierReturn electronicSupplierReturn = electronicSupplierReturnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicSupplierReturn not found with id: " + returnId));

        // Validate current status
        if (electronicSupplierReturn.getStatus() == ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER_REPLACED) {
            throw new IllegalStateException("This return has already been processed as replaced");
        }

        // Find the replacement product by serial number
        ElectronicProduct replacementProduct = electronicProductRepository.findBySerialNumber(replacementSerialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Replacement product not found with serial number: " + replacementSerialNumber));

        // Validate replacement product is available
        if (replacementProduct.getStatus() != ProductStatus.AVAILABLE) {
            throw new IllegalStateException("Replacement product is not available. Current status: " + replacementProduct.getStatus());
        }

        // Update the original product status to RETURNED_TO_SUPPLIER_REPLACED
        ElectronicProduct originalProduct = electronicSupplierReturn.getElectronicProduct();
        originalProduct.setStatus(ProductStatus.RETURNED_TO_SUPPLIER_REPLACED);
        electronicProductRepository.save(originalProduct);

        // Mark replacement product as available (it's now in stock as replacement)
        replacementProduct.setStatus(ProductStatus.AVAILABLE);
        electronicProductRepository.save(replacementProduct);

        // Update supplier return with replacement info
        electronicSupplierReturn.setStatus(ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER_REPLACED);
        electronicSupplierReturn.setReplacementSerialNumber(replacementSerialNumber);
        electronicSupplierReturn.setReplacementReason(replacementReason);
        electronicSupplierReturn.setReplacementDate(LocalDateTime.now());

        ElectronicSupplierReturn updated = electronicSupplierReturnRepository.save(electronicSupplierReturn);
        log.info("Replacement processed successfully for supplier return ID: {}", returnId);
        
        return electronicSupplierReturnMapper.toDTO(updated);
    }

    @Override
    public ElectronicSupplierReturnDTO updateReturnStatus(Long id, ElectronicSupplierReturnStatus status) {
        log.info("Updating status for supplier return ID: {} to: {}", id, status);

        ElectronicSupplierReturn electronicSupplierReturn = electronicSupplierReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicSupplierReturn not found with id: " + id));

        ElectronicSupplierReturnStatus oldStatus = electronicSupplierReturn.getStatus();
        electronicSupplierReturn.setStatus(status);

        // Update product status based on new return status
        ElectronicProduct product = electronicProductRepository.findById(electronicSupplierReturn.getElectronicProduct().getId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found"));
        updateProductStatusBasedOnReturn(product, status);

        ElectronicSupplierReturn updated = electronicSupplierReturnRepository.save(electronicSupplierReturn);
        log.info("Status updated successfully for supplier return ID: {}", id);
        
        return electronicSupplierReturnMapper.toDTO(updated);
    }

    @Override
    public void deleteElectronicSupplierReturn(Long id) {
        log.info("Deleting supplier return with ID: {}", id);

        if (!electronicSupplierReturnRepository.existsById(id)) {
            throw new ResourceNotFoundException("ElectronicSupplierReturn not found with id: " + id);
        }

        electronicSupplierReturnRepository.deleteById(id);
        log.info("Supplier return deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countByStatus(ElectronicSupplierReturnStatus status) {
        return electronicSupplierReturnRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Long countBySupplierId(Long supplierId) {
        return electronicSupplierReturnRepository.countBySupplierId(supplierId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasPendingReturnForProduct(Long productId) {
        return electronicSupplierReturnRepository.existsByElectronicProductIdAndStatus(productId, ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER);
    }

    /**
     * Helper method to update product status based on return status
     */
    private void updateProductStatusBasedOnReturn(ElectronicProduct product, ElectronicSupplierReturnStatus returnStatus) {
        switch (returnStatus) {
            case RETURNED_TO_SUPPLIER:
                product.setStatus(ProductStatus.RETURNED_TO_SUPPLIER);
                break;
            case RETURNED_TO_SUPPLIER_REPLACED:
                product.setStatus(ProductStatus.RETURNED_TO_SUPPLIER_REPLACED);
                break;
        }
        electronicProductRepository.save(product);
    }
}
