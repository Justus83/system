package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ElectronicReturnDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.entity.ElectronicReturn;
import com.salesmatrix.entity.ElectronicSale;
import com.salesmatrix.entity.ElectronicSupplierReturn;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.ReturnStatus;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ElectronicReturnMapper;
import com.salesmatrix.repository.ElectronicProductRepository;
import com.salesmatrix.repository.ElectronicReturnRepository;
import com.salesmatrix.repository.ElectronicSaleRepository;
import com.salesmatrix.repository.ElectronicSupplierReturnRepository;
import com.salesmatrix.service.ElectronicReturnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ElectronicReturnServiceImpl implements ElectronicReturnService {

    private final ElectronicReturnRepository electronicReturnRepository;
    private final ElectronicReturnMapper electronicReturnMapper;
    private final ElectronicSaleRepository electronicSaleRepository;
    private final ElectronicProductRepository electronicProductRepository;
    private final ElectronicSupplierReturnRepository electronicSupplierReturnRepository;

    @Override
    public ElectronicReturnDTO createReturn(ElectronicReturnDTO returnDTO) {
        log.info("Creating new return for sale ID: {}", returnDTO.getElectronicSaleId());

        // Validate the sale exists
        ElectronicSale sale = electronicSaleRepository.findById(returnDTO.getElectronicSaleId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicSale not found with id: " + returnDTO.getElectronicSaleId()));

        // Validate the returned product exists
        ElectronicProduct returnedProduct = electronicProductRepository.findById(returnDTO.getReturnedProductId())
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicProduct not found with id: " + returnDTO.getReturnedProductId()));

        // Set default return date if not provided
        if (returnDTO.getReturnDate() == null) {
            returnDTO.setReturnDate(LocalDateTime.now());
        }

        // Set default isReplacement if not provided
        if (returnDTO.getIsReplacement() == null) {
            returnDTO.setIsReplacement(false);
        }

        ElectronicReturn entity = electronicReturnMapper.toEntity(returnDTO);
        entity.setElectronicSale(sale);
        entity.setReturnedProduct(returnedProduct);

        // Update product status based on return status
        updateProductStatus(returnedProduct, ReturnStatus.valueOf(returnDTO.getReturnStatus()));

        // If returned to supplier, create a supplier return record
        if (ReturnStatus.valueOf(returnDTO.getReturnStatus()) == ReturnStatus.RETURNED_TO_SUPPLIER) {
            createSupplierReturnRecord(returnedProduct, returnDTO);
        }

        // Handle replacement product if provided
        if (returnDTO.getReplacementProductId() != null) {
            ElectronicProduct replacementProduct = electronicProductRepository.findById(returnDTO.getReplacementProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Replacement product not found with id: " + returnDTO.getReplacementProductId()));
            
            // Validate replacement product is available
            if (replacementProduct.getStatus() != ProductStatus.AVAILABLE) {
                throw new IllegalStateException("Replacement product must be AVAILABLE. Current status: " + replacementProduct.getStatus());
            }
            
            // Update the sale to reference the replacement product (keeps same sale data - price, date, etc.)
            sale.setProduct(replacementProduct);
            electronicSaleRepository.save(sale);
            
            // Mark replacement product as SOLD
            replacementProduct.setStatus(ProductStatus.SOLD);
            electronicProductRepository.save(replacementProduct);
            
            // Set replacement info on return entity
            entity.setReplacementProduct(replacementProduct);
            entity.setIsReplacement(true);
            entity.setReplacementDate(LocalDateTime.now());
            
            log.info("Replacement product ID: {} marked as SOLD and linked to existing sale ID: {} (keeping original sale data)", 
                     replacementProduct.getId(), sale.getId());
        }

        ElectronicReturn savedReturn = electronicReturnRepository.save(entity);
        log.info("Return created successfully with ID: {}", savedReturn.getId());

        return electronicReturnMapper.toDTO(savedReturn);
    }

    @Override
    @Transactional(readOnly = true)
    public ElectronicReturnDTO getReturnById(Long id) {
        ElectronicReturn returnEntity = electronicReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicReturn not found with id: " + id));
        return electronicReturnMapper.toDTO(returnEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getAllReturns() {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsBySaleId(Long saleId) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByElectronicSaleId(saleId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsByProductId(Long productId) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByReturnedProductId(productId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsByStatus(ReturnStatus status) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByReturnStatus(status));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsByStoreId(Long storeId) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByStoreId(storeId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByReturnDateBetween(startDate, endDate));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReturnsByStoreIdAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate) {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByStoreIdAndReturnDateBetween(storeId, startDate, endDate));
    }

    @Override
    public ElectronicReturnDTO updateReturn(Long id, ElectronicReturnDTO returnDTO) {
        log.info("Updating return with ID: {}", id);

        ElectronicReturn existingReturn = electronicReturnRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicReturn not found with id: " + id));

        // Capture old status BEFORE updating
        ReturnStatus oldStatus = existingReturn.getReturnStatus();
        log.info("Old status: {}, New status from DTO: {}", oldStatus, returnDTO.getReturnStatus());

        // Update basic fields
        electronicReturnMapper.updateEntityFromDTO(returnDTO, existingReturn);

        // If status changed, update product status and handle supplier return
        if (returnDTO.getReturnStatus() != null) {
            ReturnStatus newStatus = ReturnStatus.valueOf(returnDTO.getReturnStatus());
            
            // Update product status
            updateProductStatus(existingReturn.getReturnedProduct(), newStatus);

            // If status changed to RETURNED_TO_SUPPLIER, create supplier return record
            if (newStatus == ReturnStatus.RETURNED_TO_SUPPLIER && oldStatus != ReturnStatus.RETURNED_TO_SUPPLIER) {
                log.info("Status changed from {} to RETURNED_TO_SUPPLIER, creating supplier return record", oldStatus);
                // Use the updated entity data for creating supplier return
                ElectronicReturnDTO supplierReturnData = ElectronicReturnDTO.builder()
                        .returnDate(existingReturn.getReturnDate())
                        .returnReason(existingReturn.getReturnReason())
                        .build();
                createSupplierReturnRecord(existingReturn.getReturnedProduct(), supplierReturnData);
            } else {
                log.info("Not creating supplier return. newStatus={}, oldStatus={}, condition met: {}", 
                         newStatus, oldStatus, (newStatus == ReturnStatus.RETURNED_TO_SUPPLIER && oldStatus != ReturnStatus.RETURNED_TO_SUPPLIER));
            }
        }

        ElectronicReturn updatedReturn = electronicReturnRepository.save(existingReturn);
        log.info("Return updated successfully with ID: {}", updatedReturn.getId());

        return electronicReturnMapper.toDTO(updatedReturn);
    }

    @Override
    public ElectronicReturnDTO processReplacement(Long returnId, Long replacementProductId, String notes) {
        log.info("Processing replacement for return ID: {} with replacement product ID: {}", returnId, replacementProductId);

        ElectronicReturn existingReturn = electronicReturnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicReturn not found with id: " + returnId));

        ElectronicProduct replacementProduct = electronicProductRepository.findById(replacementProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Replacement ElectronicProduct not found with id: " + replacementProductId));

        // Validate replacement product is available
        if (replacementProduct.getStatus() != ProductStatus.AVAILABLE) {
            throw new IllegalStateException("Replacement product must be AVAILABLE. Current status: " + replacementProduct.getStatus());
        }

        ElectronicSale sale = existingReturn.getElectronicSale();
        ElectronicProduct returnedProduct = existingReturn.getReturnedProduct();

        // Update the sale to reference the replacement product instead of the returned product
        sale.setProduct(replacementProduct);
        electronicSaleRepository.save(sale);

        // Mark replacement product as SOLD
        replacementProduct.setStatus(ProductStatus.SOLD);
        electronicProductRepository.save(replacementProduct);

        // Update the return record
        existingReturn.setReplacementProduct(replacementProduct);
        existingReturn.setIsReplacement(true);
        existingReturn.setReplacementDate(LocalDateTime.now());
        if (notes != null && !notes.isEmpty()) {
            existingReturn.setNotes(notes);
        }

        // The returned product status depends on the return status
        // If RETURNED_TO_STOCK, the product becomes available
        // If RETURNED_TO_SUPPLIER, the product is marked accordingly
        // If TOTAL_LOSS, the product is marked as total loss
        if (existingReturn.getReturnStatus() == ReturnStatus.RETURNED_TO_STOCK) {
            returnedProduct.setStatus(ProductStatus.AVAILABLE);
        } else if (existingReturn.getReturnStatus() == ReturnStatus.RETURNED_TO_SUPPLIER) {
            returnedProduct.setStatus(ProductStatus.RETURNED_TO_SUPPLIER);
        } else if (existingReturn.getReturnStatus() == ReturnStatus.TOTAL_LOSS) {
            returnedProduct.setStatus(ProductStatus.TOTAL_LOSS);
        }
        electronicProductRepository.save(returnedProduct);

        ElectronicReturn updatedReturn = electronicReturnRepository.save(existingReturn);
        log.info("Replacement processed successfully for return ID: {}", updatedReturn.getId());

        return electronicReturnMapper.toDTO(updatedReturn);
    }

    @Override
    public ElectronicReturnDTO updateReturnStatus(Long returnId, ReturnStatus newStatus) {
        log.info("Updating return status for return ID: {} to: {}", returnId, newStatus);

        ElectronicReturn existingReturn = electronicReturnRepository.findById(returnId)
                .orElseThrow(() -> new ResourceNotFoundException("ElectronicReturn not found with id: " + returnId));

        ReturnStatus oldStatus = existingReturn.getReturnStatus();
        existingReturn.setReturnStatus(newStatus);

        // Update product status based on new return status
        updateProductStatus(existingReturn.getReturnedProduct(), newStatus);

        // If status changed to RETURNED_TO_SUPPLIER, create supplier return record
        if (newStatus == ReturnStatus.RETURNED_TO_SUPPLIER && oldStatus != ReturnStatus.RETURNED_TO_SUPPLIER) {
            // Use the existing return data for creating supplier return
            ElectronicReturnDTO supplierReturnData = ElectronicReturnDTO.builder()
                    .returnDate(existingReturn.getReturnDate())
                    .returnReason(existingReturn.getReturnReason())
                    .build();
            createSupplierReturnRecord(existingReturn.getReturnedProduct(), supplierReturnData);
        }

        ElectronicReturn updatedReturn = electronicReturnRepository.save(existingReturn);
        log.info("Return status updated successfully for return ID: {}", updatedReturn.getId());

        return electronicReturnMapper.toDTO(updatedReturn);
    }

    @Override
    public void deleteReturn(Long id) {
        log.info("Deleting return with ID: {}", id);

        if (!electronicReturnRepository.existsById(id)) {
            throw new ResourceNotFoundException("ElectronicReturn not found with id: " + id);
        }

        electronicReturnRepository.deleteById(id);
        log.info("Return deleted successfully with ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalLossByStoreId(Long storeId) {
        Double loss = electronicReturnRepository.calculateTotalLossByStoreId(storeId);
        return loss != null ? loss : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Double calculateTotalRefundsByStoreId(Long storeId) {
        Double refunds = electronicReturnRepository.calculateTotalRefundsByStoreId(storeId);
        return refunds != null ? refunds : 0.0;
    }

    @Override
    @Transactional(readOnly = true)
    public Long countReturnsByStoreIdAndStatus(Long storeId, ReturnStatus status) {
        return electronicReturnRepository.countByStoreIdAndReturnStatus(storeId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicReturnDTO> getReplacements() {
        return electronicReturnMapper.toDTOList(electronicReturnRepository.findByIsReplacementTrue());
    }

    /**
     * Updates the product status based on the return status.
     * 
     * @param product the product to update
     * @param returnStatus the return status determining the new product status
     */
    private void updateProductStatus(ElectronicProduct product, ReturnStatus returnStatus) {
        if (product == null || returnStatus == null) {
            return;
        }

        switch (returnStatus) {
            case RETURNED_TO_STOCK:
                product.setStatus(ProductStatus.AVAILABLE);
                break;
            case RETURNED_TO_SUPPLIER:
                product.setStatus(ProductStatus.RETURNED_TO_SUPPLIER);
                break;
            case TOTAL_LOSS:
                product.setStatus(ProductStatus.TOTAL_LOSS);
                break;
        }

        electronicProductRepository.save(product);
        log.info("Updated product ID: {} status to: {}", product.getId(), product.getStatus());
    }

    /**
     * Create a supplier return record when a product is returned to supplier
     * @param product the product being returned to supplier
     * @param returnDTO the return data
     */
    private void createSupplierReturnRecord(ElectronicProduct product, ElectronicReturnDTO returnDTO) {
        // Check if the source is a supplier
        if (product.getSourceType() != com.salesmatrix.enums.SourceType.SUPPLIER) {
            log.warn("Product ID: {} source type is {}, not SUPPLIER. Cannot create supplier return record", 
                     product.getId(), product.getSourceType());
            return;
        }

        if (product.getSupplier() == null) {
            log.warn("Product ID: {} has sourceType SUPPLIER but no supplier assigned, cannot create supplier return record", 
                     product.getId());
            return;
        }

        log.info("Checking if supplier return already exists for product ID: {}", product.getId());
        
        // Check if a supplier return already exists for this product
        boolean alreadyExists = electronicSupplierReturnRepository.existsByElectronicProductIdAndStatus(
                product.getId(), ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER);
        
        if (alreadyExists) {
            log.info("Supplier return record already exists for product ID: {}, skipping creation", product.getId());
            return;
        }

        log.info("Creating supplier return record for product ID: {} with supplier ID: {}", 
                 product.getId(), product.getSupplier().getId());

        ElectronicSupplierReturn supplierReturn = ElectronicSupplierReturn.builder()
                .supplier(product.getSupplier())
                .electronicProduct(product)
                .status(ElectronicSupplierReturnStatus.RETURNED_TO_SUPPLIER)
                .returnDate(returnDTO.getReturnDate() != null ? returnDTO.getReturnDate() : LocalDateTime.now())
                .returnReason(returnDTO.getReturnReason())
                .productValue(product.getCostPrice())
                .notes("Auto-created from customer return")
                .build();

        electronicSupplierReturnRepository.save(supplierReturn);
        log.info("Successfully created supplier return record for product ID: {} to supplier ID: {}", 
                 product.getId(), product.getSupplier().getId());
    }
}
