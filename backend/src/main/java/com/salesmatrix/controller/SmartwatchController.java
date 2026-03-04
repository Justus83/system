package com.salesmatrix.controller;

import com.salesmatrix.dto.SmartwatchDTO;
import com.salesmatrix.service.SmartwatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/smartwatches")
@RequiredArgsConstructor
public class SmartwatchController {

    private final SmartwatchService smartwatchService;

    @PostMapping
    public ResponseEntity<SmartwatchDTO> createSmartwatch(@Valid @RequestBody SmartwatchDTO smartwatchDTO) {
        SmartwatchDTO createdSmartwatch = smartwatchService.createSmartwatch(smartwatchDTO);
        return new ResponseEntity<>(createdSmartwatch, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmartwatchDTO> getSmartwatchById(@PathVariable Long id) {
        SmartwatchDTO smartwatch = smartwatchService.getSmartwatchById(id);
        return ResponseEntity.ok(smartwatch);
    }

    @GetMapping
    public ResponseEntity<List<SmartwatchDTO>> getAllSmartwatches() {
        List<SmartwatchDTO> smartwatches = smartwatchService.getAllSmartwatches();
        return ResponseEntity.ok(smartwatches);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SmartwatchDTO>> getSmartwatchesByStoreId(@PathVariable Long storeId) {
        List<SmartwatchDTO> smartwatches = smartwatchService.getSmartwatchesByStoreId(storeId);
        return ResponseEntity.ok(smartwatches);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<SmartwatchDTO>> getSmartwatchesByBrand(@PathVariable String brand) {
        List<SmartwatchDTO> smartwatches = smartwatchService.getSmartwatchesByBrand(brand);
        return ResponseEntity.ok(smartwatches);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<SmartwatchDTO> getSmartwatchBySerialNumber(@PathVariable String serialNumber) {
        SmartwatchDTO smartwatch = smartwatchService.getSmartwatchBySerialNumber(serialNumber);
        return ResponseEntity.ok(smartwatch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SmartwatchDTO> updateSmartwatch(@PathVariable Long id, @Valid @RequestBody SmartwatchDTO smartwatchDTO) {
        SmartwatchDTO updatedSmartwatch = smartwatchService.updateSmartwatch(id, smartwatchDTO);
        return ResponseEntity.ok(updatedSmartwatch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSmartwatch(@PathVariable Long id) {
        smartwatchService.deleteSmartwatch(id);
        return ResponseEntity.noContent().build();
    }
}
