package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SuiteDTO;
import com.salesmatrix.entity.Apartment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Suite;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.mapper.SuiteMapper;
import com.salesmatrix.repository.ApartmentRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SuiteRepository;
import com.salesmatrix.service.SuiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SuiteServiceImpl implements SuiteService {

    private final SuiteRepository suiteRepository;
    private final ApartmentRepository apartmentRepository;
    private final StoreRepository storeRepository;
    private final SuiteMapper suiteMapper;

    @Override
    public SuiteDTO createSuite(SuiteDTO suiteDTO) {
        Store store = storeRepository.findById(suiteDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Apartment apartment = apartmentRepository.findById(suiteDTO.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        Suite suite = suiteMapper.toEntity(suiteDTO, apartment, store);
        return suiteMapper.toDTO(suiteRepository.save(suite));
    }

    @Override
    @Transactional(readOnly = true)
    public SuiteDTO getSuiteById(Long id) {
        return suiteRepository.findById(id)
                .map(suiteMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Suite not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SuiteDTO> getAllSuites() {
        return suiteRepository.findAll().stream()
                .map(suiteMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SuiteDTO> getSuitesByStoreId(Long storeId) {
        return suiteRepository.findByStoreId(storeId).stream()
                .map(suiteMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SuiteDTO> getSuitesByApartmentId(Long apartmentId) {
        return suiteRepository.findByApartmentId(apartmentId).stream()
                .map(suiteMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SuiteDTO> getSuitesByStatus(RentalStatus status) {
        return suiteRepository.findByStatus(status).stream()
                .map(suiteMapper::toDTO)
                .toList();
    }

    @Override
    public SuiteDTO updateSuite(Long id, SuiteDTO suiteDTO) {
        Suite suite = suiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Suite not found"));
        Store store = storeRepository.findById(suiteDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Apartment apartment = apartmentRepository.findById(suiteDTO.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        suiteMapper.updateEntity(suite, suiteDTO, apartment, store);
        return suiteMapper.toDTO(suiteRepository.save(suite));
    }

    @Override
    public void deleteSuite(Long id) {
        if (!suiteRepository.existsById(id)) {
            throw new RuntimeException("Suite not found");
        }
        suiteRepository.deleteById(id);
    }
}
