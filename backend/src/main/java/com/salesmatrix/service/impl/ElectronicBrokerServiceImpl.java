package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ElectronicBrokerDTO;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.ElectronicBroker;
import com.salesmatrix.mapper.ElectronicBrokerMapper;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.ElectronicBrokerRepository;
import com.salesmatrix.service.ElectronicBrokerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ElectronicBrokerServiceImpl implements ElectronicBrokerService {

    private final ElectronicBrokerRepository electronicBrokerRepository;
    private final StoreRepository storeRepository;
    private final ElectronicBrokerMapper electronicBrokerMapper;

    @Override
    public ElectronicBrokerDTO createElectronicBroker(ElectronicBrokerDTO electronicBrokerDTO) {
        Store store = storeRepository.findById(electronicBrokerDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + electronicBrokerDTO.getStoreId()));
        ElectronicBroker electronicBroker = electronicBrokerMapper.toEntity(electronicBrokerDTO, store);
        ElectronicBroker savedElectronicBroker = electronicBrokerRepository.save(electronicBroker);
        return electronicBrokerMapper.toDTO(savedElectronicBroker);
    }

    @Override
    @Transactional(readOnly = true)
    public ElectronicBrokerDTO getElectronicBrokerById(Long id) {
        ElectronicBroker electronicBroker = electronicBrokerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ElectronicBroker not found with id: " + id));
        return electronicBrokerMapper.toDTO(electronicBroker);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerDTO> getAllElectronicBrokers() {
        return electronicBrokerRepository.findAll()
                .stream()
                .map(electronicBrokerMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ElectronicBrokerDTO> getElectronicBrokersByStoreId(Long storeId) {
        return electronicBrokerRepository.findByStoreId(storeId)
                .stream()
                .map(electronicBrokerMapper::toDTO)
                .toList();
    }

    @Override
    public ElectronicBrokerDTO updateElectronicBroker(Long id, ElectronicBrokerDTO electronicBrokerDTO) {
        ElectronicBroker electronicBroker = electronicBrokerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ElectronicBroker not found with id: " + id));
        Store store = storeRepository.findById(electronicBrokerDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + electronicBrokerDTO.getStoreId()));
        electronicBrokerMapper.updateEntity(electronicBroker, electronicBrokerDTO, store);
        ElectronicBroker updatedElectronicBroker = electronicBrokerRepository.save(electronicBroker);
        return electronicBrokerMapper.toDTO(updatedElectronicBroker);
    }

    @Override
    public void deleteElectronicBroker(Long id) {
        if (!electronicBrokerRepository.existsById(id)) {
            throw new RuntimeException("ElectronicBroker not found with id: " + id);
        }
        electronicBrokerRepository.deleteById(id);
    }
}