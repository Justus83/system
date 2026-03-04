package com.salesmatrix.service;

import com.salesmatrix.dto.SpiritDTO;

import java.util.List;

public interface SpiritService {

    SpiritDTO createSpirit(SpiritDTO spiritDTO);

    SpiritDTO getSpiritById(Long id);

    List<SpiritDTO> getAllSpirits();

    List<SpiritDTO> getSpiritsByStoreId(Long storeId);

    List<SpiritDTO> getSpiritsByBrand(String brand);

    SpiritDTO updateSpirit(Long id, SpiritDTO spiritDTO);

    void deleteSpirit(Long id);
}
