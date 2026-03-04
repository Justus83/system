package com.salesmatrix.service.impl;

import com.salesmatrix.dto.RentalHouseDTO;
import com.salesmatrix.entity.RentalHouse;
import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.mapper.RentalHouseMapper;
import com.salesmatrix.repository.RentalHouseRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.RentalHouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RentalHouseServiceImpl implements RentalHouseService {

    private final RentalHouseRepository rentalHouseRepository;
    private final StoreRepository storeRepository;
    private final RentalHouseMapper rentalHouseMapper;

    @Override
    public RentalHouseDTO createRentalHouse(RentalHouseDTO rentalHouseDTO) {
        Store store = storeRepository.findById(rentalHouseDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        RentalHouse rentalHouse = rentalHouseMapper.toEntity(rentalHouseDTO, store);
        return rentalHouseMapper.toDTO(rentalHouseRepository.save(rentalHouse));
    }

    @Override
    @Transactional(readOnly = true)
    public RentalHouseDTO getRentalHouseById(Long id) {
        return rentalHouseRepository.findById(id)
                .map(rentalHouseMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Rental house not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentalHouseDTO> getAllRentalHouses() {
        return rentalHouseRepository.findAll().stream()
                .map(rentalHouseMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentalHouseDTO> getRentalHousesByStoreId(Long storeId) {
        return rentalHouseRepository.findByStoreId(storeId).stream()
                .map(rentalHouseMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentalHouseDTO> getRentalHousesByLandlordId(Long landlordId) {
        // Method kept for interface compatibility but no longer used
        return List.of();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentalHouseDTO> getRentalHousesByStatus(RentalStatus status) {
        return rentalHouseRepository.findByStatus(status).stream()
                .map(rentalHouseMapper::toDTO)
                .toList();
    }

    @Override
    public RentalHouseDTO updateRentalHouse(Long id, RentalHouseDTO rentalHouseDTO) {
        RentalHouse rentalHouse = rentalHouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental house not found"));
        Store store = storeRepository.findById(rentalHouseDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        rentalHouseMapper.updateEntity(rentalHouse, rentalHouseDTO, store);
        return rentalHouseMapper.toDTO(rentalHouseRepository.save(rentalHouse));
    }

    @Override
    public void deleteRentalHouse(Long id) {
        if (!rentalHouseRepository.existsById(id)) {
            throw new RuntimeException("Rental house not found");
        }
        rentalHouseRepository.deleteById(id);
    }
}
