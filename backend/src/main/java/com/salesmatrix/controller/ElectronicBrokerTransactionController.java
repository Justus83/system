package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicBrokerTransactionDTO;
import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.enums.BrokerTransactionStatus;
import com.salesmatrix.enums.PaymentMethod;
import com.salesmatrix.service.ElectronicBrokerTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/electronic-broker-transactions")
@RequiredArgsConstructor
public class  ElectronicBrokerTransactionController {

    private final ElectronicBrokerTransactionService electronicBrokerTransactionService;

    @PostMapping
    public ResponseEntity<ElectronicBrokerTransactionDTO> createTransaction(@RequestBody ElectronicBrokerTransactionDTO dto) {
        ElectronicBrokerTransactionDTO createdTransaction = electronicBrokerTransactionService.createTransaction(dto);
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicBrokerTransactionDTO> getTransactionById(@PathVariable Long id) {
        ElectronicBrokerTransactionDTO transaction = electronicBrokerTransactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getAllTransactions() {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getTransactionsByStore(@PathVariable Long storeId) {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getTransactionsByStore(storeId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getTransactionsByBranch(@PathVariable Long branchId) {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getTransactionsByBranch(branchId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getTransactionsByBroker(@PathVariable Long brokerId) {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getTransactionsByBroker(brokerId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getTransactionsByProduct(@PathVariable Long productId) {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getTransactionsByProduct(productId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ElectronicBrokerTransactionDTO>> getTransactionsByStatus(@PathVariable BrokerTransactionStatus status) {
        List<ElectronicBrokerTransactionDTO> transactions = electronicBrokerTransactionService.getTransactionsByStatus(status);
        return ResponseEntity.ok(transactions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicBrokerTransactionDTO> updateTransaction(@PathVariable Long id, @RequestBody ElectronicBrokerTransactionDTO dto) {
        ElectronicBrokerTransactionDTO updatedTransaction = electronicBrokerTransactionService.updateTransaction(id, dto);
        return ResponseEntity.ok(updatedTransaction);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ElectronicBrokerTransactionDTO> updateTransactionStatus(@PathVariable Long id, @RequestParam BrokerTransactionStatus status) {
        ElectronicBrokerTransactionDTO updatedTransaction = electronicBrokerTransactionService.updateTransactionStatus(id, status);
        return ResponseEntity.ok(updatedTransaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        electronicBrokerTransactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/mark-as-sold")
    public ResponseEntity<ElectronicSaleDTO> markAsSold(
            @PathVariable Long id,
            @RequestParam Long customerId,
            @RequestParam PaymentMethod paymentMethod) {
        ElectronicSaleDTO sale = electronicBrokerTransactionService.markAsSold(id, customerId, paymentMethod);
        return new ResponseEntity<>(sale, HttpStatus.CREATED);
    }
}
