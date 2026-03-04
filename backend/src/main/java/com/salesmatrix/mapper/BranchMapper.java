package com.salesmatrix.mapper;

import com.salesmatrix.dto.BranchDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class BranchMapper {

    public Branch toEntity(BranchDTO dto, Store store) {
        return Branch.builder()
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .store(store)
                .build();
    }

    public BranchDTO toDTO(Branch branch) {
        return BranchDTO.builder()
                .id(branch.getId())
                .address(branch.getAddress())
                .phoneNumber(branch.getPhoneNumber())
                .email(branch.getEmail())
                .storeId(branch.getStore() != null ? branch.getStore().getId() : null)
                .storeName(branch.getStore() != null ? branch.getStore().getName() : null)
                .build();
    }

    public void updateEntity(Branch branch, BranchDTO dto, Store store) {
        branch.setAddress(dto.getAddress());
        branch.setPhoneNumber(dto.getPhoneNumber());
        branch.setEmail(dto.getEmail());
        branch.setStore(store);
    }
}
