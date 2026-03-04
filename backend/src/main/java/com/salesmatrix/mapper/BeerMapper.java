package com.salesmatrix.mapper;

import com.salesmatrix.dto.BeerDTO;
import com.salesmatrix.dto.BeerResponseDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.BeerSizeRepository;
import com.salesmatrix.repository.PackagingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BeerMapper {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private BeerSizeRepository beerSizeRepository;

    @Autowired
    private PackagingRepository packagingRepository;

    public Beer toEntity(BeerDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        BeerSizeEntity size = beerSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Beer size not found: " + dto.getSize()));

        PackagingEntity packaging = packagingRepository.findById(dto.getPackaging())
                .orElseThrow(() -> new IllegalArgumentException("Packaging not found: " + dto.getPackaging()));

        return Beer.builder()
                .brand(brand)
                .store(store)
                .branch(branch)
                .costPrice(dto.getCostPrice())
                .size(size)
                .packaging(packaging)
                .status(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE)
                .productCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW)
                .build();
    }

    public BeerDTO toDTO(Beer beer) {
        return BeerDTO.builder()
                .id(beer.getId())
                .brand(beer.getBrand() != null ? beer.getBrand().getId() : null)
                .brandName(beer.getBrand() != null ? beer.getBrand().getName() : null)
                .storeId(beer.getStore() != null ? beer.getStore().getId() : null)
                .storeName(beer.getStore() != null ? beer.getStore().getName() : null)
                .branchId(beer.getBranch() != null ? beer.getBranch().getId() : null)
                .branchAddress(beer.getBranch() != null ? beer.getBranch().getAddress() : null)
                .costPrice(beer.getCostPrice())
                .size(beer.getSize() != null ? beer.getSize().getId() : null)
                .sizeName(beer.getSize() != null ? beer.getSize().getName() : null)
                .packaging(beer.getPackaging() != null ? beer.getPackaging().getId() : null)
                .packagingName(beer.getPackaging() != null ? beer.getPackaging().getName() : null)
                .status(beer.getStatus() != null ? beer.getStatus().name() : null)
                .productCondition(beer.getProductCondition() != null ? beer.getProductCondition().name() : null)
                .build();
    }

    public void updateEntity(Beer beer, BeerDTO dto, Store store, Branch branch) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new IllegalArgumentException("Brand not found: " + dto.getBrand()));

        BeerSizeEntity size = beerSizeRepository.findById(dto.getSize())
                .orElseThrow(() -> new IllegalArgumentException("Beer size not found: " + dto.getSize()));

        PackagingEntity packaging = packagingRepository.findById(dto.getPackaging())
                .orElseThrow(() -> new IllegalArgumentException("Packaging not found: " + dto.getPackaging()));

        beer.setBrand(brand);
        beer.setStore(store);
        beer.setBranch(branch);
        beer.setCostPrice(dto.getCostPrice());
        beer.setSize(size);
        beer.setPackaging(packaging);
        beer.setStatus(dto.getStatus() != null ? ProductStatus.valueOf(dto.getStatus()) : ProductStatus.AVAILABLE);
        beer.setProductCondition(dto.getProductCondition() != null ? ProductCondition.valueOf(dto.getProductCondition()) : ProductCondition.NEW);
    }

    public BeerResponseDTO toResponseDTO(Beer beer) {
        return BeerResponseDTO.builder()
                .id(beer.getId())
                .brandId(beer.getBrand() != null ? beer.getBrand().getId() : null)
                .brand(beer.getBrand() != null ? beer.getBrand().getName() : null)
                .brandName(beer.getBrand() != null ? beer.getBrand().getName() : null)
                .storeId(beer.getStore() != null ? beer.getStore().getId() : null)
                .storeName(beer.getStore() != null ? beer.getStore().getName() : null)
                .branchId(beer.getBranch() != null ? beer.getBranch().getId() : null)
                .branchAddress(beer.getBranch() != null ? beer.getBranch().getAddress() : null)
                .costPrice(beer.getCostPrice())
                .sizeId(beer.getSize() != null ? beer.getSize().getId() : null)
                .size(beer.getSize() != null ? beer.getSize().getName() : null)
                .sizeName(beer.getSize() != null ? beer.getSize().getName() : null)
                .packagingId(beer.getPackaging() != null ? beer.getPackaging().getId() : null)
                .packaging(beer.getPackaging() != null ? beer.getPackaging().getName() : null)
                .packagingName(beer.getPackaging() != null ? beer.getPackaging().getName() : null)
                .status(beer.getStatus() != null ? beer.getStatus().name() : null)
                .productCondition(beer.getProductCondition() != null ? beer.getProductCondition().name() : null)
                .build();
    }
}
