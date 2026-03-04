package com.salesmatrix.controller;

import com.salesmatrix.dto.TabletDTO;
import com.salesmatrix.service.TabletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tablets")
@RequiredArgsConstructor
public class TabletController {

    private final TabletService tabletService;

    @PostMapping
    public ResponseEntity<TabletDTO> createTablet(@Valid @RequestBody TabletDTO tabletDTO) {
        TabletDTO createdTablet = tabletService.createTablet(tabletDTO);
        return new ResponseEntity<>(createdTablet, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TabletDTO> getTabletById(@PathVariable Long id) {
        TabletDTO tablet = tabletService.getTabletById(id);
        return ResponseEntity.ok(tablet);
    }

    @GetMapping
    public ResponseEntity<List<TabletDTO>> getAllTablets() {
        List<TabletDTO> tablets = tabletService.getAllTablets();
        return ResponseEntity.ok(tablets);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TabletDTO>> getTabletsByStoreId(@PathVariable Long storeId) {
        List<TabletDTO> tablets = tabletService.getTabletsByStoreId(storeId);
        return ResponseEntity.ok(tablets);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<TabletDTO>> getTabletsByBrand(@PathVariable String brand) {
        List<TabletDTO> tablets = tabletService.getTabletsByBrand(brand);
        return ResponseEntity.ok(tablets);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<TabletDTO> getTabletBySerialNumber(@PathVariable String serialNumber) {
        TabletDTO tablet = tabletService.getTabletBySerialNumber(serialNumber);
        return ResponseEntity.ok(tablet);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TabletDTO> updateTablet(@PathVariable Long id, @Valid @RequestBody TabletDTO tabletDTO) {
        TabletDTO updatedTablet = tabletService.updateTablet(id, tabletDTO);
        return ResponseEntity.ok(updatedTablet);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTablet(@PathVariable Long id) {
        tabletService.deleteTablet(id);
        return ResponseEntity.noContent().build();
    }
}
