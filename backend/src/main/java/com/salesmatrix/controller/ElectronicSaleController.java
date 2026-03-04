package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.enums.PaymentMethod;
import com.salesmatrix.service.ElectronicSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/electronic-sales")
@RequiredArgsConstructor
public class ElectronicSaleController {

    private final ElectronicSaleService electronicSaleService;

    @PostMapping
    public ResponseEntity<ElectronicSaleDTO> createSale(@RequestBody ElectronicSaleDTO dto) {
        ElectronicSaleDTO createdSale = electronicSaleService.createSale(dto);
        return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicSaleDTO> getSaleById(@PathVariable Long id) {
        ElectronicSaleDTO sale = electronicSaleService.getSaleById(id);
        return ResponseEntity.ok(sale);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicSaleDTO>> getAllSales() {
        List<ElectronicSaleDTO> sales = electronicSaleService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByStore(@PathVariable Long storeId) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByStore(storeId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByBranch(@PathVariable Long branchId) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByBranch(branchId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByCustomer(@PathVariable Long customerId) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByCustomer(customerId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/broker/{brokerId}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByBroker(@PathVariable Long brokerId) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByBroker(brokerId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByProduct(@PathVariable Long productId) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByProduct(productId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/payment-method/{paymentMethod}")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByPaymentMethod(@PathVariable PaymentMethod paymentMethod) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByPaymentMethod(paymentMethod);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByDateRange(startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/store/{storeId}/date-range")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByStoreAndDateRange(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByStoreAndDateRange(storeId, startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/branch/{branchId}/date-range")
    public ResponseEntity<List<ElectronicSaleDTO>> getSalesByBranchAndDateRange(
            @PathVariable Long branchId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<ElectronicSaleDTO> sales = electronicSaleService.getSalesByBranchAndDateRange(branchId, startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @PostMapping("/from-broker-transaction")
    public ResponseEntity<ElectronicSaleDTO> createSaleFromBrokerTransaction(
            @RequestParam Long brokerTransactionId,
            @RequestParam Long customerId,
            @RequestParam PaymentMethod paymentMethod) {
        ElectronicSaleDTO createdSale = electronicSaleService.createSaleFromBrokerTransaction(
                brokerTransactionId, customerId, paymentMethod);
        return new ResponseEntity<>(createdSale, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicSaleDTO> updateSale(@PathVariable Long id, @RequestBody ElectronicSaleDTO dto) {
        ElectronicSaleDTO updatedSale = electronicSaleService.updateSale(id, dto);
        return ResponseEntity.ok(updatedSale);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        electronicSaleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-products")
    public ResponseEntity<List<ElectronicProduct>> getAvailableElectronicProducts() {
        List<ElectronicProduct> products = electronicSaleService.getAvailableElectronicProducts();
        return ResponseEntity.ok(products);
    }
}
