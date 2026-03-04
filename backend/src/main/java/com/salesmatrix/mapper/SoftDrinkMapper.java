package com.salesmatrix.mapper;

import com.salesmatrix.dto.SoftDrinkDTO;
import com.salesmatrix.dto.SoftDrinkResponseDTO;
import com.salesmatrix.entity.SoftDrink;
import com.salesmatrix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SoftDrinkMapper {
    private final SoftDrinkTypeRepository softDrinkTypeRepository;
    private final BrandRepository brandRepository;
    private final SoftDrinkSizeRepository softDrinkSizeRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;

    public SoftDrink toEntity(SoftDrinkDTO dto) {
        return SoftDrink.builder()
                .type(softDrinkTypeRepository.findById(dto.getType())
                        .orElseThrow(() -> new RuntimeException("Type not found")))
                .brand(dto.getBrand() != null ? brandRepository.findById(dto.getBrand()).orElse(null) : null)
                .size(dto.getSize() != null ? softDrinkSizeRepository.findById(dto.getSize()).orElse(null) : null)
                .store(storeRepository.findById(dto.getStoreId())
                        .orElseThrow(() -> new RuntimeException("Store not found")))
                .branch(dto.getBranchId() != null ? branchRepository.findById(dto.getBranchId()).orElse(null) : null)
                .build();
    }

    public SoftDrinkResponseDTO toResponseDTO(SoftDrink softDrink) {
        return SoftDrinkResponseDTO.builder()
                .id(softDrink.getId())
                .typeId(softDrink.getType().getId())
                .type(softDrink.getType().getName())
                .typeName(softDrink.getType().getName())
                .brandId(softDrink.getBrand() != null ? softDrink.getBrand().getId() : null)
                .brand(softDrink.getBrand() != null ? softDrink.getBrand().getName() : null)
                .brandName(softDrink.getBrand() != null ? softDrink.getBrand().getName() : null)
                .sizeId(softDrink.getSize() != null ? softDrink.getSize().getId() : null)
                .size(softDrink.getSize() != null ? softDrink.getSize().getName() : null)
                .sizeName(softDrink.getSize() != null ? softDrink.getSize().getName() : null)
                .storeId(softDrink.getStore().getId())
                .storeName(softDrink.getStore().getName())
                .branchId(softDrink.getBranch() != null ? softDrink.getBranch().getId() : null)
                .branchAddress(softDrink.getBranch() != null ? softDrink.getBranch().getAddress() : null)
                .build();
    }
}
