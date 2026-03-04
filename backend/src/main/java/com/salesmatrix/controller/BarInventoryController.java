package com.salesmatrix.controller;

import com.salesmatrix.dto.BarInventoryDTO;
import com.salesmatrix.entity.BarInventory.ProductType;
import com.salesmatrix.service.BarInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BarInventoryController {

    private final BarInventoryService barInventoryService;

    @PostMapping
    public ResponseEntity<BarInventoryDTO> createOrUpdateInventory(@Valid @RequestBody BarInventoryDTO inventoryDTO) {
        BarInventoryDTO savedInventory = barInventoryService.createOrUpdateInventory(inventoryDTO);
        return ResponseEntity.ok(savedInventory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarInventoryDTO> getInventoryById(@PathVariable Long id) {
        BarInventoryDTO inventory = barInventoryService.getInventoryById(id);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/counter/{counterId}")
    public ResponseEntity<List<BarInventoryDTO>> getInventoryByCounter(@PathVariable Long counterId) {
        List<BarInventoryDTO> inventory = barInventoryService.getInventoryByCounterId(counterId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/counter/{counterId}/product-type/{productType}")
    public ResponseEntity<List<BarInventoryDTO>> getInventoryByCounterAndProductType(
            @PathVariable Long counterId,
            @PathVariable ProductType productType) {
        List<BarInventoryDTO> inventory = barInventoryService.getInventoryByCounterIdAndProductType(counterId, productType);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BarInventoryDTO>> getInventoryByStore(@PathVariable Long storeId) {
        List<BarInventoryDTO> inventory = barInventoryService.getInventoryByStoreId(storeId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/store/{storeId}/product-type/{productType}")
    public ResponseEntity<List<BarInventoryDTO>> getInventoryByStoreAndProductType(
            @PathVariable Long storeId,
            @PathVariable ProductType productType) {
        List<BarInventoryDTO> inventory = barInventoryService.getInventoryByStoreIdAndProductType(storeId, productType);
        return ResponseEntity.ok(inventory);
    }

    @PatchMapping("/{id}/adjust")
    public ResponseEntity<BarInventoryDTO> adjustStock(
            @PathVariable Long id,
            @RequestParam Integer adjustment) {
        BarInventoryDTO inventory = barInventoryService.getInventoryById(id);
        BarInventoryDTO adjustedInventory = barInventoryService.adjustStock(
                inventory.getCounterId(),
                inventory.getProductType(),
                inventory.getProductId(),
                adjustment
        );
        return ResponseEntity.ok(adjustedInventory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarInventoryDTO> updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody BarInventoryDTO inventoryDTO) {
        inventoryDTO.setId(id);
        BarInventoryDTO updatedInventory = barInventoryService.createOrUpdateInventory(inventoryDTO);
        return ResponseEntity.ok(updatedInventory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        barInventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }
}
