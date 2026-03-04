package com.salesmatrix.service;

import com.salesmatrix.dto.SoftDrinkDTO;
import com.salesmatrix.dto.SoftDrinkResponseDTO;

import java.util.List;

public interface SoftDrinkService {
    SoftDrinkResponseDTO createSoftDrink(SoftDrinkDTO softDrinkDTO);
    SoftDrinkResponseDTO updateSoftDrink(Long id, SoftDrinkDTO softDrinkDTO);
    void deleteSoftDrink(Long id);
    SoftDrinkResponseDTO getSoftDrinkById(Long id);
    List<SoftDrinkResponseDTO> getSoftDrinksByStore(Long storeId);
}
