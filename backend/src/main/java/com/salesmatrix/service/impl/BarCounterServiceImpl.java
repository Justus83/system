package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BarCounterDTO;
import com.salesmatrix.entity.BarCounter;
import com.salesmatrix.entity.Store;
import com.salesmatrix.mapper.BarCounterMapper;
import com.salesmatrix.repository.BarCounterRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.BarCounterService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BarCounterServiceImpl implements BarCounterService {

    private final BarCounterRepository barCounterRepository;
    private final StoreRepository storeRepository;
    private final BarCounterMapper barCounterMapper;

    @Override
    public BarCounterDTO createCounter(BarCounterDTO counterDTO) {
        Store store = storeRepository.findById(counterDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + counterDTO.getStoreId()));
        BarCounter counter = barCounterMapper.toEntity(counterDTO, store);
        BarCounter savedCounter = barCounterRepository.save(counter);
        return barCounterMapper.toDTO(savedCounter);
    }

    @Override
    @Transactional(readOnly = true)
    public BarCounterDTO getCounterById(Long id) {
        BarCounter counter = barCounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counter not found with id: " + id));
        return barCounterMapper.toDTO(counter);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarCounterDTO> getAllCounters() {
        return barCounterRepository.findAll()
                .stream()
                .map(barCounterMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarCounterDTO> getCountersByStoreId(Long storeId) {
        return barCounterRepository.findByStoreId(storeId)
                .stream()
                .map(barCounterMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarCounterDTO> getActiveCountersByStoreId(Long storeId) {
        return barCounterRepository.findByStoreIdAndActiveTrue(storeId)
                .stream()
                .map(barCounterMapper::toDTO)
                .toList();
    }

    @Override
    public BarCounterDTO updateCounter(Long id, BarCounterDTO counterDTO) {
        BarCounter counter = barCounterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Counter not found with id: " + id));
        Store store = storeRepository.findById(counterDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + counterDTO.getStoreId()));
        barCounterMapper.updateEntity(counter, counterDTO, store);
        BarCounter updatedCounter = barCounterRepository.save(counter);
        return barCounterMapper.toDTO(updatedCounter);
    }

    @Override
    public void deleteCounter(Long id) {
        if (!barCounterRepository.existsById(id)) {
            throw new RuntimeException("Counter not found with id: " + id);
        }
        barCounterRepository.deleteById(id);
    }
}
