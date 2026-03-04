package com.salesmatrix.mapper;

import com.salesmatrix.dto.TabletDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TabletMapper {

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private StorageSizeRepository storageSizeRepository;
    
    @Autowired
    private RamSizeRepository ramSizeRepository;
    
    @Autowired
    private ColorRepository colorRepository;

    public Tablet toEntity(TabletDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        StorageSizeEntity storageSize = storageSizeRepository.findByName(dto.getStorageSize())
                .orElseThrow(() -> new IllegalArgumentException("Storage size not found: " + dto.getStorageSize()));
        
        RamSizeEntity ramSize = null;
        if (dto.getRamSize() != null && !dto.getRamSize().trim().isEmpty()) {
            ramSize = ramSizeRepository.findByName(dto.getRamSize())
                    .orElseThrow(() -> new IllegalArgumentException("RAM size not found: " + dto.getRamSize()));
        }
        
        ColorEntity color = null;
        if (dto.getColor() != null && !dto.getColor().trim().isEmpty()) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        return Tablet.builder()
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
                .storageSize(storageSize)
                .ramSize(ramSize)
                .color(color)
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public TabletDTO toDTO(Tablet tablet) {
        return TabletDTO.builder()
                .id(tablet.getId())
                .brand(tablet.getBrand().getName())
                .sourceType(tablet.getSourceType().name())
                .supplierId(tablet.getSupplier() != null ? tablet.getSupplier().getId() : null)
                .supplierName(tablet.getSupplier() != null ? tablet.getSupplier().getName() : null)
                .otherSourceName(tablet.getOtherSourceName())
                .otherSourcePhoneNumber(tablet.getOtherSourcePhoneNumber())
                .storeId(tablet.getStore() != null ? tablet.getStore().getId() : null)
                .storeName(tablet.getStore() != null ? tablet.getStore().getName() : null)
                .branchId(tablet.getBranch() != null ? tablet.getBranch().getId() : null)
                .branchAddress(tablet.getBranch() != null ? tablet.getBranch().getAddress() : null)
                .costPrice(tablet.getCostPrice())
                .serialNumber(tablet.getSerialNumber())
                .model(tablet.getModel())
                .storageSize(tablet.getStorageSize().getName())
                .ramSize(tablet.getRamSize() != null ? tablet.getRamSize().getName() : null)
                .color(tablet.getColor() != null ? tablet.getColor().getName() : null)
                .status(tablet.getStatus() != null ? tablet.getStatus().name() : null)
                .productCondition(tablet.getProductCondition() != null ? tablet.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Tablet tablet, TabletDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        StorageSizeEntity storageSize = storageSizeRepository.findByName(dto.getStorageSize())
                .orElseThrow(() -> new IllegalArgumentException("Storage size not found: " + dto.getStorageSize()));
        
        RamSizeEntity ramSize = null;
        if (dto.getRamSize() != null && !dto.getRamSize().trim().isEmpty()) {
            ramSize = ramSizeRepository.findByName(dto.getRamSize())
                    .orElseThrow(() -> new IllegalArgumentException("RAM size not found: " + dto.getRamSize()));
        }
        
        ColorEntity color = null;
        if (dto.getColor() != null && !dto.getColor().trim().isEmpty()) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        tablet.setBrand(brand);
        tablet.setSourceType(SourceType.valueOf(dto.getSourceType()));
        tablet.setSupplier(supplier);
        tablet.setOtherSourceName(dto.getOtherSourceName());
        tablet.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        tablet.setStore(store);
        tablet.setBranch(branch);
        tablet.setCostPrice(dto.getCostPrice());
        tablet.setSerialNumber(dto.getSerialNumber());
        tablet.setModel(dto.getModel());
        tablet.setStorageSize(storageSize);
        tablet.setRamSize(ramSize);
        tablet.setColor(color);
        tablet.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
    }
}
