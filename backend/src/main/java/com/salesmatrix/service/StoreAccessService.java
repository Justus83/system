package com.salesmatrix.service;

import com.salesmatrix.dto.StoreAccessDTO;
import com.salesmatrix.enums.Role;

import java.util.List;

public interface StoreAccessService {

    StoreAccessDTO createStoreAccess(StoreAccessDTO storeAccessDTO);

    StoreAccessDTO getStoreAccessById(Long id);

    List<StoreAccessDTO> getAllStoreAccesses();

    List<StoreAccessDTO> getStoreAccessesByUserId(Long userId);

    List<StoreAccessDTO> getStoreAccessesByStoreId(Long storeId);

    List<StoreAccessDTO> getStoreAccessesByBranchId(Long branchId);

    List<StoreAccessDTO> getStoreAccessesByUserIdAndRole(Long userId, Role role);

    StoreAccessDTO updateStoreAccess(Long id, StoreAccessDTO storeAccessDTO);

    void deleteStoreAccess(Long id);
    
    int fixMissingStoreAccess();
}
