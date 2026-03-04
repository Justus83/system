package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ChampagneDTO;
import com.salesmatrix.dto.ChampagneResponseDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Champagne;
import com.salesmatrix.entity.Store;
import com.salesmatrix.mapper.ChampagneMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.ChampagneRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.ChampagneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChampagneServiceImpl implements ChampagneService {

    private final ChampagneRepository champagneRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final ChampagneMapper champagneMapper;

    @Override
    @Transactional
    public ChampagneResponseDTO createChampagne(ChampagneDTO champagneDTO) {
        Store store = storeRepository.findById(champagneDTO.getStoreId())
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + champagneDTO.getStoreId()));

        Branch branch = null;
        if (champagneDTO.getBranchId() != null) {
            branch = branchRepository.findById(champagneDTO.getBranchId())
                    .orElseThrow(() -> new IllegalArgumentException("Branch not found: " + champagneDTO.getBranchId()));
        }

        Champagne champagne = champagneMapper.toEntity(champagneDTO, store, branch);
        Champagne savedChampagne = champagneRepository.save(champagne);
        return champagneMapper.toResponseDTO(savedChampagne);
    }

    @Override
    @Transactional
    public ChampagneResponseDTO updateChampagne(Long id, ChampagneDTO champagneDTO) {
        Champagne champagne = champagneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Champagne not found: " + id));

        Store store = storeRepository.findById(champagneDTO.getStoreId())
                .orElseThrow(() -> new IllegalArgumentException("Store not found: " + champagneDTO.getStoreId()));

        Branch branch = null;
        if (champagneDTO.getBranchId() != null) {
            branch = branchRepository.findById(champagneDTO.getBranchId())
                    .orElseThrow(() -> new IllegalArgumentException("Branch not found: " + champagneDTO.getBranchId()));
        }

        champagneMapper.updateEntity(champagne, champagneDTO, store, branch);
        Champagne updatedChampagne = champagneRepository.save(champagne);
        return champagneMapper.toResponseDTO(updatedChampagne);
    }

    @Override
    @Transactional
    public void deleteChampagne(Long id) {
        if (!champagneRepository.existsById(id)) {
            throw new IllegalArgumentException("Champagne not found: " + id);
        }
        champagneRepository.deleteById(id);
    }

    @Override
    public ChampagneResponseDTO getChampagneById(Long id) {
        Champagne champagne = champagneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Champagne not found: " + id));
        return champagneMapper.toResponseDTO(champagne);
    }

    @Override
    public List<ChampagneResponseDTO> getChampagnesByStore(Long storeId) {
        List<Champagne> champagnes = champagneRepository.findByStoreId(storeId);
        return champagnes.stream()
                .map(champagneMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
