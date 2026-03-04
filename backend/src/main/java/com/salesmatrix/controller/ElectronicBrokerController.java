package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicBrokerDTO;
import com.salesmatrix.service.ElectronicBrokerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/electronic-brokers")
@RequiredArgsConstructor
public class ElectronicBrokerController {

    private final ElectronicBrokerService electronicBrokerService;

    @PostMapping
    public ResponseEntity<ElectronicBrokerDTO> createElectronicBroker(@Valid @RequestBody ElectronicBrokerDTO electronicBrokerDTO) {
        ElectronicBrokerDTO createdElectronicBroker = electronicBrokerService.createElectronicBroker(electronicBrokerDTO);
        return new ResponseEntity<>(createdElectronicBroker, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicBrokerDTO> getElectronicBrokerById(@PathVariable Long id) {
        ElectronicBrokerDTO electronicBroker = electronicBrokerService.getElectronicBrokerById(id);
        return ResponseEntity.ok(electronicBroker);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicBrokerDTO>> getAllElectronicBrokers() {
        List<ElectronicBrokerDTO> electronicBrokers = electronicBrokerService.getAllElectronicBrokers();
        return ResponseEntity.ok(electronicBrokers);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicBrokerDTO>> getElectronicBrokersByStoreId(@PathVariable Long storeId) {
        List<ElectronicBrokerDTO> electronicBrokers = electronicBrokerService.getElectronicBrokersByStoreId(storeId);
        return ResponseEntity.ok(electronicBrokers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicBrokerDTO> updateElectronicBroker(@PathVariable Long id, @Valid @RequestBody ElectronicBrokerDTO electronicBrokerDTO) {
        ElectronicBrokerDTO updatedElectronicBroker = electronicBrokerService.updateElectronicBroker(id, electronicBrokerDTO);
        return ResponseEntity.ok(updatedElectronicBroker);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElectronicBroker(@PathVariable Long id) {
        electronicBrokerService.deleteElectronicBroker(id);
        return ResponseEntity.noContent().build();
    }
}