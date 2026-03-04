package com.salesmatrix.mapper;

import com.salesmatrix.dto.ChampagneDTO;
import com.salesmatrix.dto.ChampagneResponseDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.ChampagneSizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ChampagneMapper {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ChampagneSizeRepository champagneSizeRepository;

    public Champagne toEntity(ChampagneDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        ChampagneSizeEntity size = null;
        if (dto.getSize() != null) {
            size = champagneSizeRepository.findById(dto.getSize())
                    .orElseThrow(() -> new IllegalArgumentException("Champagne size not found: " + dto.getSize()));
        }

        return Champagne.builder()
                .brand(brand)
                .size(size)
                .store(store)
                .branch(branch)
                .costPrice(dto.getCostPrice())
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public ChampagneDTO toDTO(Champagne champagne) {
        return ChampagneDTO.builder()
                .id(champagne.getId())
                .brand(champagne.getBrand() != null ? champagne.getBrand().getId() : null)
                .brandName(champagne.getBrand() != null ? champagne.getBrand().getName() : null)
                .size(champagne.getSize() != null ? champagne.getSize().getId() : null)
                .sizeName(champagne.getSize() != null ? champagne.getSize().getName() : null)
                .storeId(champagne.getStore() != null ? champagne.getStore().getId() : null)
                .storeName(champagne.getStore() != null ? champagne.getStore().getName() : null)
                .branchId(champagne.getBranch() != null ? champagne.getBranch().getId() : null)
                .branchAddress(champagne.getBranch() != null ? champagne.getBranch().getAddress() : null)
                .costPrice(champagne.getCostPrice())
                .status(champagne.getStatus() != null ? champagne.getStatus().name() : null)
                .productCondition(champagne.getProductCondition() != null ? champagne.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Champagne champagne, ChampagneDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        ChampagneSizeEntity size = null;
        if (dto.getSize() != null) {
            size = champagneSizeRepository.findById(dto.getSize())
                    .orElseThrow(() -> new IllegalArgumentException("Champagne size not found: " + dto.getSize()));
        }

        champagne.setBrand(brand);
        champagne.setSize(size);
        champagne.setStore(store);
        champagne.setBranch(branch);
        champagne.setCostPrice(dto.getCostPrice());
        champagne.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
        champagne.setProductCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW);
    }

    public ChampagneResponseDTO toResponseDTO(Champagne champagne) {
        return ChampagneResponseDTO.builder()
                .id(champagne.getId())
                .brandId(champagne.getBrand() != null ? champagne.getBrand().getId() : null)
                .brand(champagne.getBrand() != null ? champagne.getBrand().getName() : null)
                .brandName(champagne.getBrand() != null ? champagne.getBrand().getName() : null)
                .sizeId(champagne.getSize() != null ? champagne.getSize().getId() : null)
                .size(champagne.getSize() != null ? champagne.getSize().getName() : null)
                .sizeName(champagne.getSize() != null ? champagne.getSize().getName() : null)
                .name(champagne.getName())
                .storeId(champagne.getStore() != null ? champagne.getStore().getId() : null)
                .storeName(champagne.getStore() != null ? champagne.getStore().getName() : null)
                .branchId(champagne.getBranch() != null ? champagne.getBranch().getId() : null)
                .branchAddress(champagne.getBranch() != null ? champagne.getBranch().getAddress() : null)
                .costPrice(champagne.getCostPrice())
                .status(champagne.getStatus() != null ? champagne.getStatus().name() : null)
                .productCondition(champagne.getProductCondition() != null ? champagne.getProductCondition().name() : null)
                .build();
    }
}
