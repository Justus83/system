package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicInvestmentDTO;
import com.salesmatrix.entity.ElectronicInvestment;
import com.salesmatrix.service.ElectronicInvestmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class ElectronicInvestmentController {

    private final ElectronicInvestmentService electronicInvestmentService;

    @PostMapping
    public ResponseEntity<ElectronicInvestmentDTO> createInvestment(@RequestBody ElectronicInvestmentDTO investmentDTO) {
        ElectronicInvestmentDTO createdInvestment = electronicInvestmentService.createInvestment(investmentDTO);
        return new ResponseEntity<>(createdInvestment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicInvestmentDTO> getInvestmentById(@PathVariable Long id) {
        ElectronicInvestmentDTO investment = electronicInvestmentService.getInvestmentById(id);
        return ResponseEntity.ok(investment);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicInvestmentDTO>> getAllInvestments() {
        List<ElectronicInvestmentDTO> investments = electronicInvestmentService.getAllInvestments();
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicInvestmentDTO>> getInvestmentsByStoreId(@PathVariable Long storeId) {
        List<ElectronicInvestmentDTO> investments = electronicInvestmentService.getInvestmentsByStoreId(storeId);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ElectronicInvestmentDTO>> getInvestmentsByStatus(
            @PathVariable ElectronicInvestment.ElectronicInvestmentStatus status) {
        List<ElectronicInvestmentDTO> investments = electronicInvestmentService.getInvestmentsByStatus(status);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/store/{storeId}/status/{status}")
    public ResponseEntity<List<ElectronicInvestmentDTO>> getInvestmentsByStoreIdAndStatus(
            @PathVariable Long storeId,
            @PathVariable ElectronicInvestment.ElectronicInvestmentStatus status) {
        List<ElectronicInvestmentDTO> investments = electronicInvestmentService.getInvestmentsByStoreIdAndStatus(storeId, status);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<ElectronicInvestmentDTO>> getInvestmentsBySupplierId(@PathVariable Long supplierId) {
        List<ElectronicInvestmentDTO> investments = electronicInvestmentService.getInvestmentsBySupplierId(supplierId);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<ElectronicInvestmentDTO> getInvestmentByInvoiceNumber(@PathVariable String invoiceNumber) {
        ElectronicInvestmentDTO investment = electronicInvestmentService.getInvestmentByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(investment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicInvestmentDTO> updateInvestment(
            @PathVariable Long id,
            @RequestBody ElectronicInvestmentDTO investmentDTO) {
        ElectronicInvestmentDTO updatedInvestment = electronicInvestmentService.updateInvestment(id, investmentDTO);
        return ResponseEntity.ok(updatedInvestment);
    }

    @PostMapping("/{investmentId}/payment")
    public ResponseEntity<ElectronicInvestmentDTO> addPayment(
            @PathVariable Long investmentId,
            @RequestParam BigDecimal amount,
            @RequestParam String paymentMethod) {
        ElectronicInvestmentDTO updatedInvestment = electronicInvestmentService.addPayment(investmentId, amount, paymentMethod);
        return ResponseEntity.ok(updatedInvestment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id) {
        electronicInvestmentService.deleteInvestment(id);
        return ResponseEntity.noContent().build();
    }
}

