package com.salesmatrix.mapper;

import com.salesmatrix.dto.LaptopDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class LaptopMapper {

    @Autowired
    private BrandRepository brandRepository;
    
    @Autowired
    private StorageSizeRepository storageSizeRepository;
    
    @Autowired
    private RamSizeRepository ramSizeRepository;
    
    @Autowired
    private ColorRepository colorRepository;

    public Laptop toEntity(LaptopDTO dto, Store store, Supplier supplier, Branch branch) {
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
        
        return Laptop.builder()
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

    public LaptopDTO toDTO(Laptop laptop) {
        return LaptopDTO.builder()
                .id(laptop.getId())
                .brand(laptop.getBrand().getName())
                .sourceType(laptop.getSourceType().name())
                .supplierId(laptop.getSupplier() != null ? laptop.getSupplier().getId() : null)
                .supplierName(laptop.getSupplier() != null ? laptop.getSupplier().getName() : null)
                .otherSourceName(laptop.getOtherSourceName())
                .otherSourcePhoneNumber(laptop.getOtherSourcePhoneNumber())
                .storeId(laptop.getStore() != null ? laptop.getStore().getId() : null)
                .storeName(laptop.getStore() != null ? laptop.getStore().getName() : null)
                .branchId(laptop.getBranch() != null ? laptop.getBranch().getId() : null)
                .branchAddress(laptop.getBranch() != null ? laptop.getBranch().getAddress() : null)
                .costPrice(laptop.getCostPrice())
                .serialNumber(laptop.getSerialNumber())
                .model(laptop.getModel())
                .storageSize(laptop.getStorageSize().getName())
                .ramSize(laptop.getRamSize() != null ? laptop.getRamSize().getName() : null)
                .color(laptop.getColor() != null ? laptop.getColor().getName() : null)
                .status(laptop.getStatus() != null ? laptop.getStatus().name() : null)
                .productCondition(laptop.getProductCondition() != null ? laptop.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Laptop laptop, LaptopDTO dto, Store store, Supplier supplier, Branch branch) {
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
        
        laptop.setBrand(brand);
        laptop.setSourceType(SourceType.valueOf(dto.getSourceType()));
        laptop.setSupplier(supplier);
        laptop.setOtherSourceName(dto.getOtherSourceName());
        laptop.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        laptop.setStore(store);
        laptop.setBranch(branch);
        laptop.setCostPrice(dto.getCostPrice());
        laptop.setSerialNumber(dto.getSerialNumber());
        laptop.setModel(dto.getModel());
        laptop.setStorageSize(storageSize);
        laptop.setRamSize(ramSize);
        laptop.setColor(color);
        laptop.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
    }
}
