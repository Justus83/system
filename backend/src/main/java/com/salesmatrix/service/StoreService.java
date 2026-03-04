package com.salesmatrix.service;

import com.salesmatrix.dto.StoreDTO;

import java.util.List;

public interface StoreService {

    StoreDTO createStore(StoreDTO storeDTO);

    StoreDTO getStoreById(Long id);

    List<StoreDTO> getAllStores();
    
    List<StoreDTO> getStoresByCurrentUser();

    List<StoreDTO> getStoresByShopId(Long shopId);

    StoreDTO updateStore(Long id, StoreDTO storeDTO);

    void deleteStore(Long id);
}
