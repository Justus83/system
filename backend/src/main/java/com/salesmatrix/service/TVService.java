package com.salesmatrix.service;

import com.salesmatrix.dto.TVDTO;

import java.util.List;

public interface TVService {

    TVDTO createTV(TVDTO tvDTO);

    TVDTO getTVById(Long id);

    List<TVDTO> getAllTVs();

    List<TVDTO> getTVsByStoreId(Long storeId);

    List<TVDTO> getTVsByBrand(String brand);

    TVDTO getTVBySerialNumber(String serialNumber);

    TVDTO updateTV(Long id, TVDTO tvDTO);

    void deleteTV(Long id);
}
