package com.salesmatrix.mapper;

import com.salesmatrix.dto.JuiceDTO;
import com.salesmatrix.dto.JuiceResponseDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.JuiceSizeRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.BranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JuiceMapper {
    private final BrandRepository brandRepository;
    private final JuiceSizeRepository juiceSizeRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;

    public Juice toEntity(JuiceDTO dto) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        
        Store store = storeRepository.findById(dto.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Juice.JuiceBuilder builder = Juice.builder()
                .brand(brand)
                .store(store);

        if (dto.getSize() != null) {
            JuiceSizeEntity size = juiceSizeRepository.findById(dto.getSize())
                    .orElseThrow(() -> new RuntimeException("Juice size not found"));
            builder.size(size);
        }

        if (dto.getBranchId() != null) {
            Branch branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
            builder.branch(branch);
        }

        return builder.build();
    }

    public JuiceResponseDTO toResponseDTO(Juice juice) {
        JuiceResponseDTO.JuiceResponseDTOBuilder builder = JuiceResponseDTO.builder()
                .id(juice.getId())
                .brandId(juice.getBrand().getId())
                .brand(juice.getBrand().getName())
                .brandName(juice.getBrand().getName())
                .storeId(juice.getStore().getId())
                .storeName(juice.getStore().getName());

        if (juice.getSize() != null) {
            builder.sizeId(juice.getSize().getId())
                   .size(juice.getSize().getName())
                   .sizeName(juice.getSize().getName());
        }

        if (juice.getBranch() != null) {
            builder.branchId(juice.getBranch().getId())
                   .branchAddress(juice.getBranch().getAddress());
        }

        return builder.build();
    }

    public void updateEntity(Juice juice, JuiceDTO dto) {
        BrandEntity brand = brandRepository.findById(dto.getBrand())
                .orElseThrow(() -> new RuntimeException("Brand not found"));
        juice.setBrand(brand);

        if (dto.getSize() != null) {
            JuiceSizeEntity size = juiceSizeRepository.findById(dto.getSize())
                    .orElseThrow(() -> new RuntimeException("Juice size not found"));
            juice.setSize(size);
        } else {
            juice.setSize(null);
        }

        if (dto.getBranchId() != null) {
            Branch branch = branchRepository.findById(dto.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
            juice.setBranch(branch);
        } else {
            juice.setBranch(null);
        }
    }
}
