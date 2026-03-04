package com.salesmatrix.mapper;

import com.salesmatrix.dto.TVDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TVMapper {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private TVTypeRepository tvTypeRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private ScreenSizeRepository screenSizeRepository;

    @Autowired
    private ResolutionRepository resolutionRepository;

    public TV toEntity(TVDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        TVTypeEntity tvType = null;
        if (dto.getTvType() != null && !dto.getTvType().isEmpty()) {
            tvType = tvTypeRepository.findByName(dto.getTvType())
                    .orElseThrow(() -> new IllegalArgumentException("TV Type not found: " + dto.getTvType()));
        }
        
        ColorEntity color = null;
        if (dto.getColor() != null && !dto.getColor().isEmpty()) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        ScreenSizeEntity screenSize = null;
        if (dto.getScreenSize() != null && !dto.getScreenSize().isEmpty()) {
            screenSize = screenSizeRepository.findByName(dto.getScreenSize())
                    .orElseThrow(() -> new IllegalArgumentException("Screen Size not found: " + dto.getScreenSize()));
        }
        
        ResolutionEntity resolution = null;
        if (dto.getResolution() != null && !dto.getResolution().isEmpty()) {
            resolution = resolutionRepository.findByName(dto.getResolution())
                    .orElseThrow(() -> new IllegalArgumentException("Resolution not found: " + dto.getResolution()));
        }
        
        return TV.builder()
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
                .screenSize(screenSize)
                .displayType(dto.getDisplayType())
                .resolution(resolution)
                .tvType(tvType)
                .color(color)
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public TVDTO toDTO(TV tv) {
        return TVDTO.builder()
                .id(tv.getId())
                .brand(tv.getBrand().getName())
                .sourceType(tv.getSourceType().name())
                .supplierId(tv.getSupplier() != null ? tv.getSupplier().getId() : null)
                .supplierName(tv.getSupplier() != null ? tv.getSupplier().getName() : null)
                .otherSourceName(tv.getOtherSourceName())
                .otherSourcePhoneNumber(tv.getOtherSourcePhoneNumber())
                .storeId(tv.getStore() != null ? tv.getStore().getId() : null)
                .storeName(tv.getStore() != null ? tv.getStore().getName() : null)
                .branchId(tv.getBranch() != null ? tv.getBranch().getId() : null)
                .branchAddress(tv.getBranch() != null ? tv.getBranch().getAddress() : null)
                .costPrice(tv.getCostPrice())
                .serialNumber(tv.getSerialNumber())
                .model(tv.getModel())
                .screenSize(tv.getScreenSize() != null ? tv.getScreenSize().getName() : null)
                .displayType(tv.getDisplayType())
                .resolution(tv.getResolution() != null ? tv.getResolution().getName() : null)
                .tvType(tv.getTvType() != null ? tv.getTvType().getName() : null)
                .color(tv.getColor() != null ? tv.getColor().getName() : null)
                .status(tv.getStatus() != null ? tv.getStatus().name() : null)
                .productCondition(tv.getProductCondition() != null ? tv.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(TV tv, TVDTO dto, Store store, Supplier supplier, Branch branch) {
        BrandEntity brand = brandRepository.findByName(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));
        
        TVTypeEntity tvType = null;
        if (dto.getTvType() != null && !dto.getTvType().isEmpty()) {
            tvType = tvTypeRepository.findByName(dto.getTvType())
                    .orElseThrow(() -> new IllegalArgumentException("TV Type not found: " + dto.getTvType()));
        }
        
        ColorEntity color = null;
        if (dto.getColor() != null && !dto.getColor().isEmpty()) {
            color = colorRepository.findByName(dto.getColor())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + dto.getColor()));
        }
        
        ScreenSizeEntity screenSize = null;
        if (dto.getScreenSize() != null && !dto.getScreenSize().isEmpty()) {
            screenSize = screenSizeRepository.findByName(dto.getScreenSize())
                    .orElseThrow(() -> new IllegalArgumentException("Screen Size not found: " + dto.getScreenSize()));
        }
        
        ResolutionEntity resolution = null;
        if (dto.getResolution() != null && !dto.getResolution().isEmpty()) {
            resolution = resolutionRepository.findByName(dto.getResolution())
                    .orElseThrow(() -> new IllegalArgumentException("Resolution not found: " + dto.getResolution()));
        }
        
        tv.setBrand(brand);
        tv.setSourceType(SourceType.valueOf(dto.getSourceType()));
        tv.setSupplier(supplier);
        tv.setOtherSourceName(dto.getOtherSourceName());
        tv.setOtherSourcePhoneNumber(dto.getOtherSourcePhoneNumber());
        tv.setStore(store);
        tv.setBranch(branch);
        tv.setCostPrice(dto.getCostPrice());
        tv.setSerialNumber(dto.getSerialNumber());
        tv.setModel(dto.getModel());
        tv.setScreenSize(screenSize);
        tv.setDisplayType(dto.getDisplayType());
        tv.setResolution(resolution);
        tv.setTvType(tvType);
        tv.setColor(color);
        tv.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
    }
}
