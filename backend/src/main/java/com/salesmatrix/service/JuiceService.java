package com.salesmatrix.service;

import com.salesmatrix.dto.JuiceDTO;
import com.salesmatrix.dto.JuiceResponseDTO;

import java.util.List;

public interface JuiceService {
    JuiceResponseDTO createJuice(JuiceDTO juiceDTO);
    JuiceResponseDTO updateJuice(Long id, JuiceDTO juiceDTO);
    void deleteJuice(Long id);
    JuiceResponseDTO getJuiceById(Long id);
    List<JuiceResponseDTO> getAllJuices();
    List<JuiceResponseDTO> getJuicesByStore(Long storeId);
}
