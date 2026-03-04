package com.salesmatrix.service;

import com.salesmatrix.dto.SmartwatchDTO;

import java.util.List;

public interface SmartwatchService {

    SmartwatchDTO createSmartwatch(SmartwatchDTO smartwatchDTO);

    SmartwatchDTO getSmartwatchById(Long id);

    List<SmartwatchDTO> getAllSmartwatches();

    List<SmartwatchDTO> getSmartwatchesByStoreId(Long storeId);

    List<SmartwatchDTO> getSmartwatchesByBrand(String brand);

    SmartwatchDTO getSmartwatchBySerialNumber(String serialNumber);

    SmartwatchDTO updateSmartwatch(Long id, SmartwatchDTO smartwatchDTO);

    void deleteSmartwatch(Long id);
}
