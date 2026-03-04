package com.salesmatrix.controller;

import com.salesmatrix.dto.StoreDTO;
import com.salesmatrix.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreDTO> createStore(@Valid @RequestBody StoreDTO storeDTO) {
        StoreDTO createdStore = storeService.createStore(storeDTO);
        return new ResponseEntity<>(createdStore, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDTO> getStoreById(@PathVariable Long id) {
        StoreDTO store = storeService.getStoreById(id);
        return ResponseEntity.ok(store);
    }

    @GetMapping
    public ResponseEntity<List<StoreDTO>> getAllStores() {
        List<StoreDTO> stores = storeService.getStoresByCurrentUser();
        return ResponseEntity.ok(stores);
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<StoreDTO>> getStoresByShopId(@PathVariable Long shopId) {
        List<StoreDTO> stores = storeService.getStoresByShopId(shopId);
        return ResponseEntity.ok(stores);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreDTO> updateStore(@PathVariable Long id, @Valid @RequestBody StoreDTO storeDTO) {
        StoreDTO updatedStore = storeService.updateStore(id, storeDTO);
        return ResponseEntity.ok(updatedStore);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }
}
