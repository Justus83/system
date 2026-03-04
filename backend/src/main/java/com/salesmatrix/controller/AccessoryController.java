package com.salesmatrix.controller;

import com.salesmatrix.dto.AccessoryDTO;
import com.salesmatrix.service.AccessoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accessories")
@RequiredArgsConstructor
public class AccessoryController {

    private final AccessoryService accessoryService;

    @PostMapping
    public ResponseEntity<AccessoryDTO> createAccessory(@Valid @RequestBody AccessoryDTO accessoryDTO) {
        AccessoryDTO createdAccessory = accessoryService.createAccessory(accessoryDTO);
        return new ResponseEntity<>(createdAccessory, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccessoryDTO> getAccessoryById(@PathVariable Long id) {
        AccessoryDTO accessory = accessoryService.getAccessoryById(id);
        return ResponseEntity.ok(accessory);
    }

    @GetMapping
    public ResponseEntity<List<AccessoryDTO>> getAllAccessories() {
        List<AccessoryDTO> accessories = accessoryService.getAllAccessories();
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<AccessoryDTO>> getAccessoriesByStoreId(@PathVariable Long storeId) {
        List<AccessoryDTO> accessories = accessoryService.getAccessoriesByStoreId(storeId);
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<AccessoryDTO>> getAccessoriesByBrand(@PathVariable String brand) {
        List<AccessoryDTO> accessories = accessoryService.getAccessoriesByBrand(brand);
        return ResponseEntity.ok(accessories);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<AccessoryDTO>> getAccessoriesBySupplier(@PathVariable Long supplierId) {
        List<AccessoryDTO> accessories = accessoryService.getAccessoriesBySupplier(supplierId);
        return ResponseEntity.ok(accessories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccessoryDTO> updateAccessory(@PathVariable Long id, @Valid @RequestBody AccessoryDTO accessoryDTO) {
        AccessoryDTO updatedAccessory = accessoryService.updateAccessory(id, accessoryDTO);
        return ResponseEntity.ok(updatedAccessory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccessory(@PathVariable Long id) {
        accessoryService.deleteAccessory(id);
        return ResponseEntity.noContent().build();
    }
}
