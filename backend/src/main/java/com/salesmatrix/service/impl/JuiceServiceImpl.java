package com.salesmatrix.service.impl;

import com.salesmatrix.dto.JuiceDTO;
import com.salesmatrix.dto.JuiceResponseDTO;
import com.salesmatrix.entity.Juice;
import com.salesmatrix.mapper.JuiceMapper;
import com.salesmatrix.repository.JuiceRepository;
import com.salesmatrix.service.JuiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JuiceServiceImpl implements JuiceService {
    private final JuiceRepository juiceRepository;
    private final JuiceMapper juiceMapper;

    @Override
    @Transactional
    public JuiceResponseDTO createJuice(JuiceDTO juiceDTO) {
        Juice juice = juiceMapper.toEntity(juiceDTO);
        Juice savedJuice = juiceRepository.save(juice);
        return juiceMapper.toResponseDTO(savedJuice);
    }

    @Override
    @Transactional
    public JuiceResponseDTO updateJuice(Long id, JuiceDTO juiceDTO) {
        Juice juice = juiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Juice not found with id: " + id));
        
        juiceMapper.updateEntity(juice, juiceDTO);
        Juice updatedJuice = juiceRepository.save(juice);
        return juiceMapper.toResponseDTO(updatedJuice);
    }

    @Override
    @Transactional
    public void deleteJuice(Long id) {
        if (!juiceRepository.existsById(id)) {
            throw new RuntimeException("Juice not found with id: " + id);
        }
        juiceRepository.deleteById(id);
    }

    @Override
    public JuiceResponseDTO getJuiceById(Long id) {
        Juice juice = juiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Juice not found with id: " + id));
        return juiceMapper.toResponseDTO(juice);
    }

    @Override
    public List<JuiceResponseDTO> getAllJuices() {
        return juiceRepository.findAll().stream()
                .map(juiceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<JuiceResponseDTO> getJuicesByStore(Long storeId) {
        return juiceRepository.findByStoreId(storeId).stream()
                .map(juiceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
