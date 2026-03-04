package com.salesmatrix.service;

import com.salesmatrix.dto.SmartphoneDTO;

import java.util.List;

public interface SmartphoneService {

    SmartphoneDTO createSmartphone(SmartphoneDTO smartphoneDTO);

    SmartphoneDTO getSmartphoneById(Long id);

    List<SmartphoneDTO> getAllSmartphones();

    List<SmartphoneDTO> getSmartphonesByStoreId(Long storeId);

    List<SmartphoneDTO> getSmartphonesByBrand(String brand);

    SmartphoneDTO getSmartphoneBySerialNumber(String serialNumber);

    SmartphoneDTO updateSmartphone(Long id, SmartphoneDTO smartphoneDTO);

    void deleteSmartphone(Long id);
}
