package com.salesmatrix.controller;

import com.salesmatrix.dto.StoreAccessDTO;
import com.salesmatrix.enums.Role;
import com.salesmatrix.service.StoreAccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store-access")
@RequiredArgsConstructor
public class StoreAccessController {

    private final StoreAccessService storeAccessService;

    @PostMapping
    public ResponseEntity<StoreAccessDTO> createStoreAccess(@Valid @RequestBody StoreAccessDTO storeAccessDTO) {
        StoreAccessDTO createdStoreAccess = storeAccessService.createStoreAccess(storeAccessDTO);
        return new ResponseEntity<>(createdStoreAccess, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreAccessDTO> getStoreAccessById(@PathVariable Long id) {
        StoreAccessDTO storeAccess = storeAccessService.getStoreAccessById(id);
        return ResponseEntity.ok(storeAccess);
    }

    @GetMapping
    public ResponseEntity<List<StoreAccessDTO>> getAllStoreAccesses() {
        List<StoreAccessDTO> storeAccesses = storeAccessService.getAllStoreAccesses();
        return ResponseEntity.ok(storeAccesses);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StoreAccessDTO>> getStoreAccessesByUserId(@PathVariable Long userId) {
        List<StoreAccessDTO> storeAccesses = storeAccessService.getStoreAccessesByUserId(userId);
        return ResponseEntity.ok(storeAccesses);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<StoreAccessDTO>> getStoreAccessesByStoreId(@PathVariable Long storeId) {
        List<StoreAccessDTO> storeAccesses = storeAccessService.getStoreAccessesByStoreId(storeId);
        return ResponseEntity.ok(storeAccesses);
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<StoreAccessDTO>> getStoreAccessesByBranchId(@PathVariable Long branchId) {
        List<StoreAccessDTO> storeAccesses = storeAccessService.getStoreAccessesByBranchId(branchId);
        return ResponseEntity.ok(storeAccesses);
    }

    @GetMapping("/user/{userId}/role/{role}")
    public ResponseEntity<List<StoreAccessDTO>> getStoreAccessesByUserIdAndRole(
            @PathVariable Long userId,
            @PathVariable Role role) {
        List<StoreAccessDTO> storeAccesses = storeAccessService.getStoreAccessesByUserIdAndRole(userId, role);
        return ResponseEntity.ok(storeAccesses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreAccessDTO> updateStoreAccess(@PathVariable Long id, @Valid @RequestBody StoreAccessDTO storeAccessDTO) {
        StoreAccessDTO updatedStoreAccess = storeAccessService.updateStoreAccess(id, storeAccessDTO);
        return ResponseEntity.ok(updatedStoreAccess);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreAccess(@PathVariable Long id) {
        storeAccessService.deleteStoreAccess(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/fix-missing")
    public ResponseEntity<String> fixMissingStoreAccess() {
        // This endpoint creates StoreAccess records for users who created stores but don't have access
        // This is a utility endpoint to fix data inconsistencies
        int fixed = storeAccessService.fixMissingStoreAccess();
        return ResponseEntity.ok("Fixed " + fixed + " missing store access records");
    }
}
