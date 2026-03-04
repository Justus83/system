package com.salesmatrix.mapper;

import com.salesmatrix.dto.StoreAccessDTO;
import com.salesmatrix.dto.StoreDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StoreAccessMapper {

    private final StoreMapper storeMapper;

    public StoreAccess toEntity(StoreAccessDTO dto, User user, Store store, Branch branch) {
        return StoreAccess.builder()
                .user(user)
                .store(store)
                .branch(branch)
                .role(dto.getRole())
                .build();
    }

    public StoreAccessDTO toDTO(StoreAccess storeAccess) {
        StoreDTO storeDTO = null;
        if (storeAccess.getStore() != null) {
            storeDTO = storeMapper.toDTO(storeAccess.getStore());
        }
        
        return StoreAccessDTO.builder()
                .id(storeAccess.getId())
                .userId(storeAccess.getUser() != null ? storeAccess.getUser().getId() : null)
                .userName(storeAccess.getUser() != null ? storeAccess.getUser().getName() : null)
                .userEmail(storeAccess.getUser() != null ? storeAccess.getUser().getEmail() : null)
                .storeId(storeAccess.getStore() != null ? storeAccess.getStore().getId() : null)
                .storeName(storeAccess.getStore() != null ? storeAccess.getStore().getName() : null)
                .branchId(storeAccess.getBranch() != null ? storeAccess.getBranch().getId() : null)
                .branchAddress(storeAccess.getBranch() != null ? storeAccess.getBranch().getAddress() : null)
                .role(storeAccess.getRole())
                .store(storeDTO)
                .build();
    }

    public void updateEntity(StoreAccess storeAccess, StoreAccessDTO dto, User user, Store store, Branch branch) {
        storeAccess.setUser(user);
        storeAccess.setStore(store);
        storeAccess.setBranch(branch);
        storeAccess.setRole(dto.getRole());
    }
}
