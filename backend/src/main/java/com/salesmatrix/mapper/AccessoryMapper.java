package com.salesmatrix.mapper;

import com.salesmatrix.dto.AccessoryDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccessoryMapper {

    @Autowired
    private BrandRepository brandRepository;

    public Accessory toEntity(AccessoryDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        return Accessory.builder()
                .brand(brand)
                .sourceType(SourceType.valueOf(dto.getSourceType()))
                .supplier(supplier)
                .otherSourceName(dto.getOtherSourceName())
                .otherSourcePhoneNumber(dto.getOtherSourcePhoneNumber())
                .store(store)
                .branch(branch)
                .costPrice(dto.getCostPrice())
                .name(dto.getCategory())
                .quantity(dto.getQuantity())
                .build();
    }

    public AccessoryDTO toDTO(Accessory accessory) {
        return AccessoryDTO.builder()
                .id(accessory.getId())
                .brand(accessory.getBrand().getName())
                .category(accessory.getName())
                .quantity(accessory.getQuantity())
                .sourceType(accessory.getSourceType().name())
                .supplierId(accessory.getSupplier() != null ? accessory.getSupplier().getId() : null)
                .supplierName(accessory.getSupplier() != null ? accessory.getSupplier().getName() : null)
                .otherSourceName(accessory.getOtherSourceName())
                .otherSourcePhoneNumber(accessory.getOtherSourcePhoneNumber())
                .storeId(accessory.getStore() != null ? accessory.getStore().getId() : null)
                .storeName(accessory.getStore() != null ? accessory.getStore().getName() : null)
                .branchId(accessory.getBranch() != null ? accessory.getBranch().getId() : null)
                .branchAddress(accessory.getBranch() != null ? accessory.getBranch().getAddress() : null)
                .costPrice(accessory.getCostPrice())
                .build();
    }

    public void updateEntity(Accessory accessory, AccessoryDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        accessory.setBrand(brand);
        accessory.setSourceType(SourceType.valueOf(dto.getSourceType()));
        accessory.setSupplier(supplier);
        accessory.setOtherSourceName(dto.getOtherSourceName());
        accessory.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        accessory.setStore(store);
        accessory.setBranch(branch);
        accessory.setCostPrice(dto.getCostPrice());
        accessory.setName(dto.getCategory());
        accessory.setQuantity(dto.getQuantity());
    }
}
