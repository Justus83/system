package com.salesmatrix.service.impl;

import com.salesmatrix.dto.WineDTO;
import com.salesmatrix.dto.WineResponseDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Wine;
import com.salesmatrix.mapper.WineMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.WineRepository;
import com.salesmatrix.service.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WineServiceImpl implements WineService {

    private final WineRepository wineRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final WineMapper wineMapper;

    @Override
    @Transactional
    public WineResponseDTO createWine(WineDTO wineDTO) {
        Store store = storeRepository.findById(wineDTO.getStoreId())
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + wineDTO.getStoreId()));

        Branch branch = null;
        if (wineDTO.getBranchId() != null) {
            branch = branchRepository.findById(wineDTO.getBranchId())
                    .orElseThrow(() -> new IllegalArgumentException("Branch not found: " + wineDTO.getBranchId()));
        }

        Wine wine = wineMapper.toEntity(wineDTO, store, branch);
        Wine savedWine = wineRepository.save(wine);
        return wineMapper.toResponseDTO(savedWine);
    }

    @Override
    @Transactional
    public WineResponseDTO updateWine(Long id, WineDTO wineDTO) {
        Wine wine = wineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wine not found: " + id));

        Store store = storeRepository.findById(wineDTO.getStoreId())
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + wineDTO.getStoreId()));

        Branch branch = null;
        if (wineDTO.getBranchId() != null) {
            branch = branchRepository.findById(wineDTO.getBranchId())
                    .orElseThrow(() -> new IllegalArgumentException("Branch not found: " + wineDTO.getBranchId()));
        }

        wineMapper.updateEntity(wine, wineDTO, store, branch);
        Wine updatedWine = wineRepository.save(wine);
        return wineMapper.toResponseDTO(updatedWine);
    }

    @Override
    @Transactional
    public void deleteWine(Long id) {
        if (!wineRepository.existsById(id)) {
            throw new IllegalArgumentException("Wine not found: " + id);
        }
        wineRepository.deleteById(id);
    }

    @Override
    public WineResponseDTO getWineById(Long id) {
        Wine wine = wineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Wine not found: " + id));
        return wineMapper.toResponseDTO(wine);
    }

    @Override
    public List<WineResponseDTO> getWinesByStore(Long storeId) {
        List<Wine> wines = wineRepository.findByStoreId(storeId);
        return wines.stream()
                .map(wineMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
