package com.salesmatrix.mapper;

import com.salesmatrix.dto.SmartwatchDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SmartwatchMapper {

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private ColorRepository colorRepository;

    public Smartwatch toEntity(SmartwatchDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        ColorEntity color = null;
        if (dto.getColor() != null) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        return Smartwatch.builder()
                .brand(brand)
                .sourceType(SourceType.valueOf(dto.getSourceType()))
                .supplier(supplier)
                .otherSourceName(dto.getOtherSourceName())
                .otherSourcePhoneNumber(dto.getOtherSourcePhoneNumber())
                .store(store)
                .branch(branch)
                .costPrice(dto.getCostPrice())
                .serialNumber(dto.getSerialNumber())
                .model(dto.getModel())
                .color(color)
                .caseSizeMM(dto.getCaseSizeMM())
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public SmartwatchDTO toDTO(Smartwatch smartwatch) {
        return SmartwatchDTO.builder()
                .id(smartwatch.getId())
                .brand(smartwatch.getBrand().getName())
                .sourceType(smartwatch.getSourceType().name())
                .supplierId(smartwatch.getSupplier() != null ? smartwatch.getSupplier().getId() : null)
                .supplierName(smartwatch.getSupplier() != null ? smartwatch.getSupplier().getName() : null)
                .otherSourceName(smartwatch.getOtherSourceName())
                .otherSourcePhoneNumber(smartwatch.getOtherSourcePhoneNumber())
                .storeId(smartwatch.getStore() != null ? smartwatch.getStore().getId() : null)
                .storeName(smartwatch.getStore() != null ? smartwatch.getStore().getName() : null)
                .branchId(smartwatch.getBranch() != null ? smartwatch.getBranch().getId() : null)
                .branchAddress(smartwatch.getBranch() != null ? smartwatch.getBranch().getAddress() : null)
                .costPrice(smartwatch.getCostPrice())
                .serialNumber(smartwatch.getSerialNumber())
                .model(smartwatch.getModel())
                .color(smartwatch.getColor() != null ? smartwatch.getColor().getName() : null)
                .caseSizeMM(smartwatch.getCaseSizeMM())
                .status(smartwatch.getStatus() != null ? smartwatch.getStatus().name() : null)
                .productCondition(smartwatch.getProductCondition() != null ? smartwatch.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Smartwatch smartwatch, SmartwatchDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        ColorEntity color = null;
        if (dto.getColor() != null) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        smartwatch.setBrand(brand);
        smartwatch.setSourceType(SourceType.valueOf(dto.getSourceType()));
        smartwatch.setSupplier(supplier);
        smartwatch.setOtherSourceName(dto.getOtherSourceName());
        smartwatch.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        smartwatch.setStore(store);
        smartwatch.setBranch(branch);
        smartwatch.setCostPrice(dto.getCostPrice());
        smartwatch.setSerialNumber(dto.getSerialNumber());
        smartwatch.setModel(dto.getModel());
        smartwatch.setColor(color);
        smartwatch.setCaseSizeMM(dto.getCaseSizeMM());
        smartwatch.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
    }
}
