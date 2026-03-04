package com.salesmatrix.mapper;

import com.salesmatrix.dto.WineDTO;
import com.salesmatrix.dto.WineResponseDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.WineSizeRepository;
import com.salesmatrix.repository.WineTypeRepository;
import com.salesmatrix.repository.WineYearRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class WineMapper {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private WineSizeRepository wineSizeRepository;

    @Autowired
    private WineTypeRepository wineTypeRepository;

    @Autowired
    private WineYearRepository wineYearRepository;

    public Wine toEntity(WineDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        WineTypeEntity type = wineTypeRepository.findById(dto.getType())
                .orElseThrow(() -> new IllegalArgumentException("Wine type not found: " + dto.getType()));

        WineSizeEntity size = wineSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Wine size not found: " + dto.getSize()));

        WineYearEntity year = null;
        if (dto.getYear() != null) {
            year = wineYearRepository.findById(dto.getYear())
                    .orElseThrow(() -> new IllegalArgumentException("Wine year not found: " + dto.getYear()));
        }

        return Wine.builder()
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

    public WineDTO toDTO(Wine wine) {
        return WineDTO.builder()
                .id(wine.getId())
                .brand(wine.getBrand() != null ? wine.getBrand().getId() : null)
                .brandName(wine.getBrand() != null ? wine.getBrand().getName() : null)
                .type(wine.getType() != null ? wine.getType().getId() : null)
                .typeName(wine.getType() != null ? wine.getType().getName() : null)
                .size(wine.getSize() != null ? wine.getSize().getId() : null)
                .sizeName(wine.getSize() != null ? wine.getSize().getName() : null)
                .year(wine.getYear() != null ? wine.getYear().getId() : null)
                .yearName(wine.getYear() != null ? wine.getYear().getName() : null)
                .storeId(wine.getStore() != null ? wine.getStore().getId() : null)
                .storeName(wine.getStore() != null ? wine.getStore().getName() : null)
                .branchId(wine.getBranch() != null ? wine.getBranch().getId() : null)
                .branchAddress(wine.getBranch() != null ? wine.getBranch().getAddress() : null)
                .costPrice(wine.getCostPrice())
                .status(wine.getStatus() != null ? wine.getStatus().name() : null)
                .productCondition(wine.getProductCondition() != null ? wine.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Wine wine, WineDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        WineTypeEntity type = wineTypeRepository.findById(dto.getType())
                .orElseThrow(() -> new IllegalArgumentException("Wine type not found: " + dto.getType()));

        WineSizeEntity size = wineSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Wine size not found: " + dto.getSize()));

        WineYearEntity year = null;
        if (dto.getYear() != null) {
            year = wineYearRepository.findById(dto.getYear())
                    .orElseThrow(() -> new IllegalArgumentException("Wine year not found: " + dto.getYear()));
        }

        wine.setBrand(brand);
        wine.setType(type);
        wine.setSize(size);
        wine.setYear(year);
        wine.setStore(store);
        wine.setBranch(branch);
        wine.setCostPrice(dto.getCostPrice());
        wine.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
        wine.setProductCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW);
    }

    public WineResponseDTO toResponseDTO(Wine wine) {
        return WineResponseDTO.builder()
                .id(wine.getId())
                .brandId(wine.getBrand() != null ? wine.getBrand().getId() : null)
                .brand(wine.getBrand() != null ? wine.getBrand().getName() : null)
                .brandName(wine.getBrand() != null ? wine.getBrand().getName() : null)
                .typeId(wine.getType() != null ? wine.getType().getId() : null)
                .type(wine.getType() != null ? wine.getType().getName() : null)
                .typeName(wine.getType() != null ? wine.getType().getName() : null)
                .sizeId(wine.getSize() != null ? wine.getSize().getId() : null)
                .size(wine.getSize() != null ? wine.getSize().getName() : null)
                .sizeName(wine.getSize() != null ? wine.getSize().getName() : null)
                .yearId(wine.getYear() != null ? wine.getYear().getId() : null)
                .year(wine.getYear() != null ? wine.getYear().getName() : null)
                .yearName(wine.getYear() != null ? wine.getYear().getName() : null)
                .name(wine.getName())
                .storeId(wine.getStore() != null ? wine.getStore().getId() : null)
                .storeName(wine.getStore() != null ? wine.getStore().getName() : null)
                .branchId(wine.getBranch() != null ? wine.getBranch().getId() : null)
                .branchAddress(wine.getBranch() != null ? wine.getBranch().getAddress() : null)
                .costPrice(wine.getCostPrice())
                .status(wine.getStatus() != null ? wine.getStatus().name() : null)
                .productCondition(wine.getProductCondition() != null ? wine.getProductCondition().name() : null)
                .build();
    }
}
