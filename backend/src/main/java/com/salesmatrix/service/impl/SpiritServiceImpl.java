package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SpiritDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Spirit;
import com.salesmatrix.entity.Store;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.SpiritMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.SpiritRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.SpiritService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SpiritServiceImpl implements SpiritService {

    private final SpiritRepository spiritRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final SpiritMapper spiritMapper;

    @Override
    public SpiritDTO createSpirit(SpiritDTO spiritDTO) {
        Store store = storeRepository.findById(spiritDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + spiritDTO.getStoreId()));

        Branch branch = null;
        if (spiritDTO.getBranchId() != null) {
            branch = branchRepository.findById(spiritDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + spiritDTO.getBranchId()));
        }

        // Check for duplicate spirit
        List<Spirit> existingSpirits = spiritRepository.findByTypeAndBrandAndSizeAndStore(
            spiritDTO.getType(),
            spiritDTO.getBrand(), 
            spiritDTO.getSize(),
            spiritDTO.getStoreId()
        );
        
        if (!existingSpirits.isEmpty()) {
            throw new ResourceNotFoundException("A spirit with this Type, Brand, and Size combination already exists in this store");
        }

        Spirit spirit = spiritMapper.toEntity(spiritDTO, store, branch);
        Spirit savedSpirit = spiritRepository.save(spirit);
        return spiritMapper.toDTO(savedSpirit);
    }

    @Override
    @Transactional(readOnly = true)
    public SpiritDTO getSpiritById(Long id) {
        Spirit spirit = spiritRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spirit not found with id: " + id));
        return spiritMapper.toDTO(spirit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpiritDTO> getAllSpirits() {
        return spiritRepository.findAll()
                .stream()
                .map(spiritMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpiritDTO> getSpiritsByStoreId(Long storeId) {
        return spiritRepository.findByStoreId(storeId)
                .stream()
                .map(spiritMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SpiritDTO> getSpiritsByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return spiritRepository.findByBrand(brandEntity)
                .stream()
                .map(spiritMapper::toDTO)
                .toList();
    }

    @Override
    public SpiritDTO updateSpirit(Long id, SpiritDTO spiritDTO) {
        Spirit spirit = spiritRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spirit not found with id: " + id));

        Store store = storeRepository.findById(spiritDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + spiritDTO.getStoreId()));

        Branch branch = null;
        if (spiritDTO.getBranchId() != null) {
            branch = branchRepository.findById(spiritDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + spiritDTO.getBranchId()));
        }

        // Check for duplicate spirit (excluding current spirit)
        List<Spirit> existingSpirits = spiritRepository.findByTypeAndBrandAndSizeAndStore(
            spiritDTO.getType(),
            spiritDTO.getBrand(), 
            spiritDTO.getSize(),
            spiritDTO.getStoreId()
        );
        
        if (!existingSpirits.isEmpty() && !existingSpirits.get(0).getId().equals(id)) {
            throw new ResourceNotFoundException("A spirit with this Type, Brand, and Size combination already exists in this store");
        }

        spiritMapper.updateEntity(spirit, spiritDTO, store, branch);
        Spirit updatedSpirit = spiritRepository.save(spirit);
        return spiritMapper.toDTO(updatedSpirit);
    }

    @Override
    public void deleteSpirit(Long id) {
        if (!spiritRepository.existsById(id)) {
            throw new ResourceNotFoundException("Spirit not found with id: " + id);
        }
        spiritRepository.deleteById(id);
    }
}
