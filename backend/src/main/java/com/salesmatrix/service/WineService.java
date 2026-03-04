package com.salesmatrix.service;

import com.salesmatrix.dto.WineDTO;
import com.salesmatrix.dto.WineResponseDTO;

import java.util.List;

public interface WineService {
    WineResponseDTO createWine(WineDTO wineDTO);
    WineResponseDTO updateWine(Long id, WineDTO wineDTO);
    void deleteWine(Long id);
    WineResponseDTO getWineById(Long id);
    List<WineResponseDTO> getWinesByStore(Long storeId);
}
