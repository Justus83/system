package com.salesmatrix.controller;

import com.salesmatrix.dto.BranchDTO;
import com.salesmatrix.service.BranchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    @PostMapping
    public ResponseEntity<BranchDTO> createBranch(@Valid @RequestBody BranchDTO branchDTO) {
        BranchDTO createdBranch = branchService.createBranch(branchDTO);
        return new ResponseEntity<>(createdBranch, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchDTO> getBranchById(@PathVariable Long id) {
        BranchDTO branch = branchService.getBranchById(id);
        return ResponseEntity.ok(branch);
    }

    @GetMapping
    public ResponseEntity<List<BranchDTO>> getAllBranches() {
        List<BranchDTO> branches = branchService.getAllBranches();
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BranchDTO>> getBranchesByStoreId(@PathVariable Long storeId) {
        List<BranchDTO> branches = branchService.getBranchesByStoreId(storeId);
        return ResponseEntity.ok(branches);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchDTO> updateBranch(@PathVariable Long id, @Valid @RequestBody BranchDTO branchDTO) {
        BranchDTO updatedBranch = branchService.updateBranch(id, branchDTO);
        return ResponseEntity.ok(updatedBranch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }
}
