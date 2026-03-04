package com.salesmatrix.service;

import com.salesmatrix.dto.AccessoryDTO;

import java.util.List;

public interface AccessoryService {

    AccessoryDTO createAccessory(AccessoryDTO accessoryDTO);

    AccessoryDTO getAccessoryById(Long id);

    List<AccessoryDTO> getAllAccessories();

    List<AccessoryDTO> getAccessoriesByStoreId(Long storeId);

    List<AccessoryDTO> getAccessoriesByBrand(String brand);

    List<AccessoryDTO> getAccessoriesBySupplier(Long supplierId);

    AccessoryDTO updateAccessory(Long id, AccessoryDTO accessoryDTO);

    void deleteAccessory(Long id);
}
