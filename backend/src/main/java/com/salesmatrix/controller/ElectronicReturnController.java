package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicReturnDTO;
import com.salesmatrix.enums.ReturnStatus;
import com.salesmatrix.service.ElectronicReturnService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/electronic-returns")
@RequiredArgsConstructor
public class ElectronicReturnController {

    private final ElectronicReturnService electronicReturnService;

    @PostMapping
    public ResponseEntity<ElectronicReturnDTO> createReturn(@RequestBody ElectronicReturnDTO returnDTO) {
        ElectronicReturnDTO createdReturn = electronicReturnService.createReturn(returnDTO);
        return new ResponseEntity<>(createdReturn, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicReturnDTO> getReturnById(@PathVariable Long id) {
        ElectronicReturnDTO returnDTO = electronicReturnService.getReturnById(id);
        return ResponseEntity.ok(returnDTO);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicReturnDTO>> getAllReturns() {
        List<ElectronicReturnDTO> returns = electronicReturnService.getAllReturns();
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsBySaleId(@PathVariable Long saleId) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsBySaleId(saleId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsByProductId(@PathVariable Long productId) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsByProductId(productId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsByStatus(@PathVariable ReturnStatus status) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsByStatus(status);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsByStoreId(@PathVariable Long storeId) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsByStoreId(storeId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsByDateRange(startDate, endDate);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/store/{storeId}/date-range")
    public ResponseEntity<List<ElectronicReturnDTO>> getReturnsByStoreIdAndDateRange(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicReturnDTO> returns = electronicReturnService.getReturnsByStoreIdAndDateRange(storeId, startDate, endDate);
        return ResponseEntity.ok(returns);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicReturnDTO> updateReturn(
            @PathVariable Long id,
            @RequestBody ElectronicReturnDTO returnDTO) {
        ElectronicReturnDTO updatedReturn = electronicReturnService.updateReturn(id, returnDTO);
        return ResponseEntity.ok(updatedReturn);
    }

    @PostMapping("/{returnId}/process-replacement")
    public ResponseEntity<ElectronicReturnDTO> processReplacement(
            @PathVariable Long returnId,
            @RequestParam Long replacementProductId,
            @RequestParam(required = false) String notes) {
        ElectronicReturnDTO updatedReturn = electronicReturnService.processReplacement(returnId, replacementProductId, notes);
        return ResponseEntity.ok(updatedReturn);
    }

    @PatchMapping("/{returnId}/status")
    public ResponseEntity<ElectronicReturnDTO> updateReturnStatus(
            @PathVariable Long returnId,
            @RequestParam ReturnStatus newStatus) {
        ElectronicReturnDTO updatedReturn = electronicReturnService.updateReturnStatus(returnId, newStatus);
        return ResponseEntity.ok(updatedReturn);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReturn(@PathVariable Long id) {
        electronicReturnService.deleteReturn(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}/total-loss")
    public ResponseEntity<Double> calculateTotalLossByStoreId(@PathVariable Long storeId) {
        Double totalLoss = electronicReturnService.calculateTotalLossByStoreId(storeId);
        return ResponseEntity.ok(totalLoss);
    }

    @GetMapping("/store/{storeId}/total-refunds")
    public ResponseEntity<Double> calculateTotalRefundsByStoreId(@PathVariable Long storeId) {
        Double totalRefunds = electronicReturnService.calculateTotalRefundsByStoreId(storeId);
        return ResponseEntity.ok(totalRefunds);
    }

    @GetMapping("/store/{storeId}/count/{status}")
    public ResponseEntity<Long> countReturnsByStoreIdAndStatus(
            @PathVariable Long storeId,
            @PathVariable ReturnStatus status) {
        Long count = electronicReturnService.countReturnsByStoreIdAndStatus(storeId, status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/replacements")
    public ResponseEntity<List<ElectronicReturnDTO>> getReplacements() {
        List<ElectronicReturnDTO> replacements = electronicReturnService.getReplacements();
        return ResponseEntity.ok(replacements);
    }
}
