package com.salesmatrix.mapper;

import com.salesmatrix.dto.SpiritDTO;
import com.salesmatrix.dto.SpiritResponseDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.SpiritSizeRepository;
import com.salesmatrix.repository.SpiritTypeRepository;
import com.salesmatrix.repository.SpiritYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SpiritMapper {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private SpiritSizeRepository spiritSizeRepository;

    @Autowired
    private SpiritTypeRepository spiritTypeRepository;

    @Autowired
    private SpiritYearRepository spiritYearRepository;

    public Spirit toEntity(SpiritDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        SpiritTypeEntity type = spiritTypeRepository.findById(dto.getType())
                .orElseThrow(() -> new IllegalArgumentException("Spirit type not found: " + dto.getType()));

        SpiritSizeEntity size = spiritSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Spirit size not found: " + dto.getSize()));

        SpiritYearEntity year = null;
        if (dto.getYear() != null) {
            year = spiritYearRepository.findById(dto.getYear())
                    .orElseThrow(() -> new IllegalArgumentException("Spirit year not found: " + dto.getYear()));
        }

        return Spirit.builder()
                .brand(brand)
                .type(type)
                .size(size)
                .year(year)
                .store(store)
                .branch(branch)
                .costPrice(dto.getCostPrice())
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public SpiritDTO toDTO(Spirit spirit) {
        return SpiritDTO.builder()
                .id(spirit.getId())
                .brand(spirit.getBrand() != null ? spirit.getBrand().getId() : null)
                .brandName(spirit.getBrand() != null ? spirit.getBrand().getName() : null)
                .type(spirit.getType() != null ? spirit.getType().getId() : null)
                .typeName(spirit.getType() != null ? spirit.getType().getName() : null)
                .size(spirit.getSize() != null ? spirit.getSize().getId() : null)
                .sizeName(spirit.getSize() != null ? spirit.getSize().getName() : null)
                .year(spirit.getYear() != null ? spirit.getYear().getId() : null)
                .yearName(spirit.getYear() != null ? spirit.getYear().getName() : null)
                .storeId(spirit.getStore() != null ? spirit.getStore().getId() : null)
                .storeName(spirit.getStore() != null ? spirit.getStore().getName() : null)
                .branchId(spirit.getBranch() != null ? spirit.getBranch().getId() : null)
                .branchAddress(spirit.getBranch() != null ? spirit.getBranch().getAddress() : null)
                .costPrice(spirit.getCostPrice())
                .status(spirit.getStatus() != null ? spirit.getStatus().name() : null)
                .productCondition(spirit.getProductCondition() != null ? spirit.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Spirit spirit, SpiritDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        SpiritTypeEntity type = spiritTypeRepository.findById(dto.getType())
                .orElseThrow(() -> new IllegalArgumentException("Spirit type not found: " + dto.getType()));

        SpiritSizeEntity size = spiritSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Spirit size not found: " + dto.getSize()));

        SpiritYearEntity year = null;
        if (dto.getYear() != null) {
            year = spiritYearRepository.findById(dto.getYear())
                    .orElseThrow(() -> new IllegalArgumentException("Spirit year not found: " + dto.getYear()));
        }

        spirit.setBrand(brand);
        spirit.setType(type);
        spirit.setSize(size);
        spirit.setYear(year);
        spirit.setStore(store);
        spirit.setBranch(branch);
        spirit.setCostPrice(dto.getCostPrice());
        spirit.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
        spirit.setProductCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW);
    }

    public SpiritResponseDTO toResponseDTO(Spirit spirit) {
        return SpiritResponseDTO.builder()
                .id(spirit.getId())
                .brandId(spirit.getBrand() != null ? spirit.getBrand().getId() : null)
                .brand(spirit.getBrand() != null ? spirit.getBrand().getName() : null)
                .brandName(spirit.getBrand() != null ? spirit.getBrand().getName() : null)
                .typeId(spirit.getType() != null ? spirit.getType().getId() : null)
                .type(spirit.getType() != null ? spirit.getType().getName() : null)
                .typeName(spirit.getType() != null ? spirit.getType().getName() : null)
                .sizeId(spirit.getSize() != null ? spirit.getSize().getId() : null)
                .size(spirit.getSize() != null ? spirit.getSize().getName() : null)
                .sizeName(spirit.getSize() != null ? spirit.getSize().getName() : null)
                .yearId(spirit.getYear() != null ? spirit.getYear().getId() : null)
                .year(spirit.getYear() != null ? spirit.getYear().getName() : null)
                .yearName(spirit.getYear() != null ? spirit.getYear().getName() : null)
                .name(spirit.getName())
                .storeId(spirit.getStore() != null ? spirit.getStore().getId() : null)
                .storeName(spirit.getStore() != null ? spirit.getStore().getName() : null)
                .branchId(spirit.getBranch() != null ? spirit.getBranch().getId() : null)
                .branchAddress(spirit.getBranch() != null ? spirit.getBranch().getAddress() : null)
                .costPrice(spirit.getCostPrice())
                .status(spirit.getStatus() != null ? spirit.getStatus().name() : null)
                .productCondition(spirit.getProductCondition() != null ? spirit.getProductCondition().name() : null)
                .build();
    }
}
