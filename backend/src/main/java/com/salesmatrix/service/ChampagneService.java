package com.salesmatrix.service;

import com.salesmatrix.dto.ChampagneDTO;
import com.salesmatrix.dto.ChampagneResponseDTO;

import java.util.List;

public interface ChampagneService {
    ChampagneResponseDTO createChampagne(ChampagneDTO champagneDTO);
    ChampagneResponseDTO updateChampagne(Long id, ChampagneDTO champagneDTO);
    void deleteChampagne(Long id);
    ChampagneResponseDTO getChampagneById(Long id);
    List<ChampagneResponseDTO> getChampagnesByStore(Long storeId);
}
