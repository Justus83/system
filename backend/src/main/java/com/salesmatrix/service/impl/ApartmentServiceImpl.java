package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ApartmentDTO;
import com.salesmatrix.entity.Apartment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.mapper.ApartmentMapper;
import com.salesmatrix.repository.ApartmentRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;
    private final StoreRepository storeRepository;
    private final ApartmentMapper apartmentMapper;

    @Override
    public ApartmentDTO createApartment(ApartmentDTO apartmentDTO) {
        Store store = storeRepository.findById(apartmentDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Apartment apartment = apartmentMapper.toEntity(apartmentDTO, store);
        return apartmentMapper.toDTO(apartmentRepository.save(apartment));
    }

    @Override
    @Transactional(readOnly = true)
    public ApartmentDTO getApartmentById(Long id) {
        return apartmentRepository.findById(id)
                .map(apartmentMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApartmentDTO> getAllApartments() {
        return apartmentRepository.findAll().stream()
                .map(apartmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApartmentDTO> getApartmentsByStoreId(Long storeId) {
        return apartmentRepository.findByStoreId(storeId).stream()
                .map(apartmentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApartmentDTO> getApartmentsByLandlordId(Long landlordId) {
        // Method kept for interface compatibility but no longer used
        return List.of();
    }

    @Override
    public ApartmentDTO updateApartment(Long id, ApartmentDTO apartmentDTO) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartment not found"));
        Store store = storeRepository.findById(apartmentDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        apartmentMapper.updateEntity(apartment, apartmentDTO, store);
        return apartmentMapper.toDTO(apartmentRepository.save(apartment));
    }

    @Override
    public void deleteApartment(Long id) {
        if (!apartmentRepository.existsById(id)) {
            throw new RuntimeException("Apartment not found");
        }
        apartmentRepository.deleteById(id);
    }
}
