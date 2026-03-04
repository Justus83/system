package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SoftDrinkDTO;
import com.salesmatrix.dto.SoftDrinkResponseDTO;
import com.salesmatrix.entity.SoftDrink;
import com.salesmatrix.mapper.SoftDrinkMapper;
import com.salesmatrix.repository.SoftDrinkRepository;
import com.salesmatrix.service.SoftDrinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoftDrinkServiceImpl implements SoftDrinkService {
    private final SoftDrinkRepository softDrinkRepository;
    private final SoftDrinkMapper softDrinkMapper;

    @Override
    @Transactional
    public SoftDrinkResponseDTO createSoftDrink(SoftDrinkDTO softDrinkDTO) {
        SoftDrink softDrink = softDrinkMapper.toEntity(softDrinkDTO);
        SoftDrink saved = softDrinkRepository.save(softDrink);
        return softDrinkMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public SoftDrinkResponseDTO updateSoftDrink(Long id, SoftDrinkDTO softDrinkDTO) {
        SoftDrink existing = softDrinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Soft drink not found"));
        
        SoftDrink updated = softDrinkMapper.toEntity(softDrinkDTO);
        updated.setId(existing.getId());
        
        SoftDrink saved = softDrinkRepository.save(updated);
        return softDrinkMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteSoftDrink(Long id) {
        softDrinkRepository.deleteById(id);
    }

    @Override
    public SoftDrinkResponseDTO getSoftDrinkById(Long id) {
        SoftDrink softDrink = softDrinkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Soft drink not found"));
        return softDrinkMapper.toResponseDTO(softDrink);
    }

    @Override
    public List<SoftDrinkResponseDTO> getSoftDrinksByStore(Long storeId) {
        return softDrinkRepository.findByStoreId(storeId).stream()
                .map(softDrinkMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
