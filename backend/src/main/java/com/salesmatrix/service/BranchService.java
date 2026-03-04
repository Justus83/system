package com.salesmatrix.service;

import com.salesmatrix.dto.BranchDTO;

import java.util.List;

public interface BranchService {

    BranchDTO createBranch(BranchDTO branchDTO);

    BranchDTO getBranchById(Long id);

    List<BranchDTO> getAllBranches();

    List<BranchDTO> getBranchesByStoreId(Long storeId);

    BranchDTO updateBranch(Long id, BranchDTO branchDTO);

    void deleteBranch(Long id);
}
