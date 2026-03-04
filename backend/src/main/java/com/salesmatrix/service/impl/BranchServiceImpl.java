package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BranchDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.mapper.BranchMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;
    private final StoreRepository storeRepository;
    private final BranchMapper branchMapper;

    @Override
    public BranchDTO createBranch(BranchDTO branchDTO) {
        Store store = storeRepository.findById(branchDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + branchDTO.getStoreId()));
        Branch branch = branchMapper.toEntity(branchDTO, store);
        Branch savedBranch = branchRepository.save(branch);
        return branchMapper.toDTO(savedBranch);
    }

    @Override
    @Transactional(readOnly = true)
    public BranchDTO getBranchById(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + id));
        return branchMapper.toDTO(branch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchDTO> getAllBranches() {
        return branchRepository.findAll()
                .stream()
                .map(branchMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BranchDTO> getBranchesByStoreId(Long storeId) {
        return branchRepository.findByStoreId(storeId)
                .stream()
                .map(branchMapper::toDTO)
                .toList();
    }

    @Override
    public BranchDTO updateBranch(Long id, BranchDTO branchDTO) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + id));
        Store store = storeRepository.findById(branchDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + branchDTO.getStoreId()));
        branchMapper.updateEntity(branch, branchDTO, store);
        Branch updatedBranch = branchRepository.save(branch);
        return branchMapper.toDTO(updatedBranch);
    }

    @Override
    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new RuntimeException("Branch not found with id: " + id);
        }
        branchRepository.deleteById(id);
    }
}
