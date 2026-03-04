package com.salesmatrix.controller;

import com.salesmatrix.dto.BarSaleDTO;
import com.salesmatrix.service.BarSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bar-sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BarSaleController {

    private final BarSaleService barSaleService;

    @PostMapping
    public ResponseEntity<BarSaleDTO> createSale(@Valid @RequestBody BarSaleDTO saleDTO) {
        BarSaleDTO savedSale = barSaleService.createSale(saleDTO);
        return ResponseEntity.ok(savedSale);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarSaleDTO> getSaleById(@PathVariable Long id) {
        BarSaleDTO sale = barSaleService.getSaleById(id);
        return ResponseEntity.ok(sale);
    }

    @GetMapping
    public ResponseEntity<List<BarSaleDTO>> getAllSales() {
        List<BarSaleDTO> sales = barSaleService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/counter/{counterId}")
    public ResponseEntity<List<BarSaleDTO>> getSalesByCounter(@PathVariable Long counterId) {
        List<BarSaleDTO> sales = barSaleService.getSalesByCounter(counterId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BarSaleDTO>> getSalesByStore(@PathVariable Long storeId) {
        List<BarSaleDTO> sales = barSaleService.getSalesByStore(storeId);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<BarSaleDTO>> getSalesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<BarSaleDTO> sales = barSaleService.getSalesByDateRange(startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/counter/{counterId}/date-range")
    public ResponseEntity<List<BarSaleDTO>> getSalesByCounterAndDateRange(
            @PathVariable Long counterId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<BarSaleDTO> sales = barSaleService.getSalesByCounterAndDateRange(counterId, startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @GetMapping("/store/{storeId}/date-range")
    public ResponseEntity<List<BarSaleDTO> > getSalesByStoreAndDateRange(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<BarSaleDTO> sales = barSaleService.getSalesByStoreAndDateRange(storeId, startDate, endDate);
        return ResponseEntity.ok(sales);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        barSaleService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
}
