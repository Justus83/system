package com.salesmatrix.mapper;

import com.salesmatrix.dto.SmartphoneDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SmartphoneMapper {

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private StorageSizeRepository storageSizeRepository;
    
    @Autowired
    private RamSizeRepository ramSizeRepository;
    
    @Autowired
    private ColorRepository colorRepository;

    public Smartphone toEntity(SmartphoneDTO dto, Store store, Supplier supplier, Branch branch) {
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
        
        return Smartphone.builder()
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

    public SmartphoneDTO toDTO(Smartphone smartphone) {
        return SmartphoneDTO.builder()
                .id(smartphone.getId())
                .brand(smartphone.getBrand().getName())
                .sourceType(smartphone.getSourceType().name())
                .supplierId(smartphone.getSupplier() != null ? smartphone.getSupplier().getId() : null)
                .supplierName(smartphone.getSupplier() != null ? smartphone.getSupplier().getName() : null)
                .otherSourceName(smartphone.getOtherSourceName())
                .otherSourcePhoneNumber(smartphone.getOtherSourcePhoneNumber())
                .storeId(smartphone.getStore() != null ? smartphone.getStore().getId() : null)
                .storeName(smartphone.getStore() != null ? smartphone.getStore().getName() : null)
                .branchId(smartphone.getBranch() != null ? smartphone.getBranch().getId() : null)
                .branchAddress(smartphone.getBranch() != null ? smartphone.getBranch().getAddress() : null)
                .costPrice(smartphone.getCostPrice())
                .serialNumber(smartphone.getSerialNumber())
                .model(smartphone.getModel())
                .storageSize(smartphone.getStorageSize().getName())
                .ramSize(smartphone.getRamSize() != null ? smartphone.getRamSize().getName() : null)
                .color(smartphone.getColor() != null ? smartphone.getColor().getName() : null)
                .status(smartphone.getStatus() != null ? smartphone.getStatus().name() : null)
                .productCondition(smartphone.getProductCondition() != null ? smartphone.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Smartphone smartphone, SmartphoneDTO dto, Store store, Supplier supplier, Branch branch) {
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
        
        smartphone.setBrand(brand);
        smartphone.setSourceType(SourceType.valueOf(dto.getSourceType()));
        smartphone.setSupplier(supplier);
        smartphone.setOtherSourceName(dto.getOtherSourceName());
        smartphone.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        smartphone.setStore(store);
        smartphone.setBranch(branch);
        smartphone.setCostPrice(dto.getCostPrice());
        smartphone.setSerialNumber(dto.getSerialNumber());
        smartphone.setModel(dto.getModel());
        smartphone.setStorageSize(storageSize);
        smartphone.setRamSize(ramSize);
        smartphone.setColor(color);
        smartphone.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
    }
}
