package com.salesmatrix.service;

import com.salesmatrix.dto.BarInventoryDTO;
import com.salesmatrix.entity.BarInventory.ProductType;

import java.util.List;

public interface BarInventoryService {

    BarInventoryDTO createOrUpdateInventory(BarInventoryDTO inventoryDTO);

    BarInventoryDTO getInventoryById(Long id);

    List<BarInventoryDTO> getInventoryByCounterId(Long counterId);

    List<BarInventoryDTO> getInventoryByCounterIdAndProductType(Long counterId, ProductType productType);

    List<BarInventoryDTO> getInventoryByStoreId(Long storeId);

    List<BarInventoryDTO> getInventoryByStoreIdAndProductType(Long storeId, ProductType productType);

    BarInventoryDTO adjustStock(Long counterId, ProductType productType, Long productId, Integer adjustment);

    void deleteInventory(Long id);
}

