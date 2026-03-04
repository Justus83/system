package com.salesmatrix.service.impl;

import com.salesmatrix.dto.StoreAccessDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.enums.Role;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import com.salesmatrix.mapper.StoreAccessMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.UserRepository;
import com.salesmatrix.service.StoreAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreAccessServiceImpl implements StoreAccessService {

    private final StoreAccessRepository storeAccessRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final StoreAccessMapper storeAccessMapper;

    @Override
    public StoreAccessDTO createStoreAccess(StoreAccessDTO storeAccessDTO) {
        User user = userRepository.findById(storeAccessDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + storeAccessDTO.getUserId()));

        Store store = storeRepository.findById(storeAccessDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeAccessDTO.getStoreId()));

        Branch branch = null;
        if (storeAccessDTO.getBranchId() != null) {
            branch = branchRepository.findById(storeAccessDTO.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + storeAccessDTO.getBranchId()));
        }

        StoreAccess storeAccess = storeAccessMapper.toEntity(storeAccessDTO, user, store, branch);
        StoreAccess savedStoreAccess = storeAccessRepository.save(storeAccess);
        return storeAccessMapper.toDTO(savedStoreAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public StoreAccessDTO getStoreAccessById(Long id) {
        StoreAccess storeAccess = storeAccessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StoreAccess not found with id: " + id));
        return storeAccessMapper.toDTO(storeAccess);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreAccessDTO> getAllStoreAccesses() {
        return storeAccessRepository.findAll()
                .stream()
                .map(storeAccessMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreAccessDTO> getStoreAccessesByUserId(Long userId) {
        return storeAccessRepository.findByUserIdWithStore(userId)
                .stream()
                .map(storeAccessMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreAccessDTO> getStoreAccessesByStoreId(Long storeId) {
        return storeAccessRepository.findByStoreId(storeId)
                .stream()
                .map(storeAccessMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreAccessDTO> getStoreAccessesByBranchId(Long branchId) {
        return storeAccessRepository.findByBranchId(branchId)
                .stream()
                .map(storeAccessMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreAccessDTO> getStoreAccessesByUserIdAndRole(Long userId, Role role) {
        return storeAccessRepository.findByUserIdAndRole(userId, role)
                .stream()
                .map(storeAccessMapper::toDTO)
                .toList();
    }

    @Override
    public StoreAccessDTO updateStoreAccess(Long id, StoreAccessDTO storeAccessDTO) {
        StoreAccess storeAccess = storeAccessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StoreAccess not found with id: " + id));

        User user = userRepository.findById(storeAccessDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + storeAccessDTO.getUserId()));

        Store store = storeRepository.findById(storeAccessDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeAccessDTO.getStoreId()));

        Branch branch = null;
        if (storeAccessDTO.getBranchId() != null) {
            branch = branchRepository.findById(storeAccessDTO.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + storeAccessDTO.getBranchId()));
        }

        storeAccessMapper.updateEntity(storeAccess, storeAccessDTO, user, store, branch);
        StoreAccess updatedStoreAccess = storeAccessRepository.save(storeAccess);
        return storeAccessMapper.toDTO(updatedStoreAccess);
    }

    @Override
    public void deleteStoreAccess(Long id) {
        if (!storeAccessRepository.existsById(id)) {
            throw new RuntimeException("StoreAccess not found with id: " + id);
        }
        storeAccessRepository.deleteById(id);
    }
    
    @Override
    public int fixMissingStoreAccess() {
        // This method is a utility to fix missing StoreAccess records
        // It's not a permanent solution but helps recover from data inconsistencies
        
        // For now, we'll just return 0 and log a message
        // In a real scenario, you'd need to determine which users should have access to which stores
        // This typically requires business logic or manual intervention
        
        System.out.println("fixMissingStoreAccess called - this requires manual intervention");
        System.out.println("Please use the SQL script or manually create StoreAccess records");
        
        return 0;
    }
}
