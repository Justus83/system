package com.salesmatrix.controller;

import com.salesmatrix.dto.SmartphoneDTO;
import com.salesmatrix.service.SmartphoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/smartphones")
@RequiredArgsConstructor
public class SmartphoneController {

    private final SmartphoneService smartphoneService;

    @PostMapping
    public ResponseEntity<SmartphoneDTO> createSmartphone(@Valid @RequestBody SmartphoneDTO smartphoneDTO) {
        SmartphoneDTO createdSmartphone = smartphoneService.createSmartphone(smartphoneDTO);
        return new ResponseEntity<>(createdSmartphone, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmartphoneDTO> getSmartphoneById(@PathVariable Long id) {
        SmartphoneDTO smartphone = smartphoneService.getSmartphoneById(id);
        return ResponseEntity.ok(smartphone);
    }

    @GetMapping
    public ResponseEntity<List<SmartphoneDTO>> getAllSmartphones() {
        List<SmartphoneDTO> smartphones = smartphoneService.getAllSmartphones();
        return ResponseEntity.ok(smartphones);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SmartphoneDTO>> getSmartphonesByStoreId(@PathVariable Long storeId) {
        List<SmartphoneDTO> smartphones = smartphoneService.getSmartphonesByStoreId(storeId);
        return ResponseEntity.ok(smartphones);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<SmartphoneDTO>> getSmartphonesByBrand(@PathVariable String brand) {
        List<SmartphoneDTO> smartphones = smartphoneService.getSmartphonesByBrand(brand);
        return ResponseEntity.ok(smartphones);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<SmartphoneDTO> getSmartphoneBySerialNumber(@PathVariable String serialNumber) {
        SmartphoneDTO smartphone = smartphoneService.getSmartphoneBySerialNumber(serialNumber);
        return ResponseEntity.ok(smartphone);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SmartphoneDTO> updateSmartphone(@PathVariable Long id, @Valid @RequestBody SmartphoneDTO smartphoneDTO) {
        SmartphoneDTO updatedSmartphone = smartphoneService.updateSmartphone(id, smartphoneDTO);
        return ResponseEntity.ok(updatedSmartphone);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSmartphone(@PathVariable Long id) {
        smartphoneService.deleteSmartphone(id);
        return ResponseEntity.noContent().build();
    }
}
