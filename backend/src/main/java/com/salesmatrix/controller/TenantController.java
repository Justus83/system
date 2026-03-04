package com.salesmatrix.controller;

import com.salesmatrix.dto.TenantDTO;
import com.salesmatrix.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<TenantDTO> createTenant(@Valid @RequestBody TenantDTO tenantDTO) {
        return new ResponseEntity<>(tenantService.createTenant(tenantDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantDTO> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenantById(id));
    }

    @GetMapping
    public ResponseEntity<List<TenantDTO>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TenantDTO>> getTenantsByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(tenantService.getTenantsByStoreId(storeId));
    }

    @GetMapping("/rental-house/{rentalHouseId}")
    public ResponseEntity<List<TenantDTO>> getTenantsByRentalHouseId(@PathVariable Long rentalHouseId) {
        return ResponseEntity.ok(tenantService.getTenantsByRentalHouseId(rentalHouseId));
    }

    @GetMapping("/suite/{suiteId}")
    public ResponseEntity<List<TenantDTO>> getTenantsBySuiteId(@PathVariable Long suiteId) {
        return ResponseEntity.ok(tenantService.getTenantsBySuiteId(suiteId));
    }

    @GetMapping("/hostel-room/{hostelRoomId}")
    public ResponseEntity<List<TenantDTO>> getTenantsByHostelRoomId(@PathVariable Long hostelRoomId) {
        return ResponseEntity.ok(tenantService.getTenantsByHostelRoomId(hostelRoomId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenantDTO> updateTenant(@PathVariable Long id, @Valid @RequestBody TenantDTO tenantDTO) {
        return ResponseEntity.ok(tenantService.updateTenant(id, tenantDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
}
