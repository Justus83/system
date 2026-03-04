package com.salesmatrix.controller;

import com.salesmatrix.dto.RentPaymentDTO;
import com.salesmatrix.service.RentPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rent-payments")
@RequiredArgsConstructor
public class RentPaymentController {

    private final RentPaymentService rentPaymentService;

    @PostMapping
    public ResponseEntity<RentPaymentDTO> createRentPayment(@Valid @RequestBody RentPaymentDTO rentPaymentDTO) {
        return new ResponseEntity<>(rentPaymentService.createRentPayment(rentPaymentDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentPaymentDTO> getRentPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(rentPaymentService.getRentPaymentById(id));
    }

    @GetMapping
    public ResponseEntity<List<RentPaymentDTO>> getAllRentPayments() {
        return ResponseEntity.ok(rentPaymentService.getAllRentPayments());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<RentPaymentDTO>> getRentPaymentsByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(rentPaymentService.getRentPaymentsByStoreId(storeId));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<RentPaymentDTO>> getRentPaymentsByTenantId(@PathVariable Long tenantId) {
        return ResponseEntity.ok(rentPaymentService.getRentPaymentsByTenantId(tenantId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentPaymentDTO> updateRentPayment(@PathVariable Long id, @Valid @RequestBody RentPaymentDTO rentPaymentDTO) {
        return ResponseEntity.ok(rentPaymentService.updateRentPayment(id, rentPaymentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentPayment(@PathVariable Long id) {
        rentPaymentService.deleteRentPayment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/sign")
    public ResponseEntity<RentPaymentDTO> signPayment(@PathVariable Long id, @RequestParam String signedBy) {
        return ResponseEntity.ok(rentPaymentService.signPayment(id, signedBy));
    }
}
