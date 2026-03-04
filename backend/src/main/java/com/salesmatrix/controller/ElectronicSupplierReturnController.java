package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicSupplierReturnDTO;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import com.salesmatrix.service.ElectronicSupplierReturnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/supplier-returns")
@RequiredArgsConstructor
@Slf4j
public class ElectronicSupplierReturnController {

    private final ElectronicSupplierReturnService electronicSupplierReturnService;

    @PostMapping
    public ResponseEntity<ElectronicSupplierReturnDTO> createElectronicSupplierReturn(@RequestBody ElectronicSupplierReturnDTO dto) {
        log.info("Creating supplier return for product ID: {}", dto.getElectronicProductId());
        ElectronicSupplierReturnDTO created = electronicSupplierReturnService.createElectronicSupplierReturn(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicSupplierReturnDTO> getElectronicSupplierReturnById(@PathVariable Long id) {
        ElectronicSupplierReturnDTO dto = electronicSupplierReturnService.getElectronicSupplierReturnById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getAllElectronicSupplierReturns() {
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getAllElectronicSupplierReturns();
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsBySupplierId(@PathVariable Long supplierId) {
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsBySupplierId(supplierId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsByProductId(@PathVariable Long productId) {
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsByProductId(productId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsByStatus(@PathVariable String status) {
        ElectronicSupplierReturnStatus returnStatus = ElectronicSupplierReturnStatus.valueOf(status.toUpperCase());
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsByStatus(returnStatus);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/supplier/{supplierId}/status/{status}")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsBySupplierIdAndStatus(
            @PathVariable Long supplierId,
            @PathVariable String status) {
        ElectronicSupplierReturnStatus returnStatus = ElectronicSupplierReturnStatus.valueOf(status.toUpperCase());
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsBySupplierIdAndStatus(supplierId, returnStatus);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsByDateRange(startDate, endDate);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/supplier/{supplierId}/date-range")
    public ResponseEntity<List<ElectronicSupplierReturnDTO>> getElectronicSupplierReturnsBySupplierIdAndDateRange(
            @PathVariable Long supplierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicSupplierReturnDTO> returns = electronicSupplierReturnService.getElectronicSupplierReturnsBySupplierIdAndDateRange(supplierId, startDate, endDate);
        return ResponseEntity.ok(returns);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicSupplierReturnDTO> updateElectronicSupplierReturn(
            @PathVariable Long id,
            @RequestBody ElectronicSupplierReturnDTO dto) {
        log.info("Updating supplier return with ID: {}", id);
        ElectronicSupplierReturnDTO updated = electronicSupplierReturnService.updateElectronicSupplierReturn(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/process-replacement")
    public ResponseEntity<ElectronicSupplierReturnDTO> processReplacement(
            @PathVariable Long id,
            @RequestParam String replacementSerialNumber,
            @RequestParam String replacementReason) {
        log.info("Processing replacement for supplier return ID: {} with serial: {}", id, replacementSerialNumber);
        ElectronicSupplierReturnDTO updated = electronicSupplierReturnService.processReplacement(id, replacementSerialNumber, replacementReason);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ElectronicSupplierReturnDTO> updateReturnStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("Updating status for supplier return ID: {} to: {}", id, status);
        ElectronicSupplierReturnStatus returnStatus = ElectronicSupplierReturnStatus.valueOf(status.toUpperCase());
        ElectronicSupplierReturnDTO updated = electronicSupplierReturnService.updateReturnStatus(id, returnStatus);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteElectronicSupplierReturn(@PathVariable Long id) {
        log.info("Deleting supplier return with ID: {}", id);
        electronicSupplierReturnService.deleteElectronicSupplierReturn(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countByStatus(@PathVariable String status) {
        ElectronicSupplierReturnStatus returnStatus = ElectronicSupplierReturnStatus.valueOf(status.toUpperCase());
        Long count = electronicSupplierReturnService.countByStatus(returnStatus);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/supplier/{supplierId}")
    public ResponseEntity<Long> countBySupplierId(@PathVariable Long supplierId) {
        Long count = electronicSupplierReturnService.countBySupplierId(supplierId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/product/{productId}/has-pending")
    public ResponseEntity<Boolean> hasPendingReturnForProduct(@PathVariable Long productId) {
        boolean hasPending = electronicSupplierReturnService.hasPendingReturnForProduct(productId);
        return ResponseEntity.ok(hasPending);
    }
}
