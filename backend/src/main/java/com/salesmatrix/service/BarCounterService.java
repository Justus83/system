package com.salesmatrix.service;

import com.salesmatrix.dto.BarCounterDTO;

import java.util.List;

public interface BarCounterService {

    BarCounterDTO createCounter(BarCounterDTO counterDTO);

    BarCounterDTO getCounterById(Long id);

    List<BarCounterDTO> getAllCounters();

    List<BarCounterDTO> getCountersByStoreId(Long storeId);

    List<BarCounterDTO> getActiveCountersByStoreId(Long storeId);

    BarCounterDTO updateCounter(Long id, BarCounterDTO counterDTO);

    void deleteCounter(Long id);
}
