package com.salesmatrix.controller;

import com.salesmatrix.dto.TVDTO;
import com.salesmatrix.service.TVService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tvs")
@RequiredArgsConstructor
public class TVController {

    private final TVService tvService;

    @PostMapping
    public ResponseEntity<TVDTO> createTV(@Valid @RequestBody TVDTO tvDTO) {
        TVDTO createdTV = tvService.createTV(tvDTO);
        return new ResponseEntity<>(createdTV, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TVDTO> getTVById(@PathVariable Long id) {
        TVDTO tv = tvService.getTVById(id);
        return ResponseEntity.ok(tv);
    }

    @GetMapping
    public ResponseEntity<List<TVDTO>> getAllTVs() {
        List<TVDTO> tvs = tvService.getAllTVs();
        return ResponseEntity.ok(tvs);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<TVDTO>> getTVsByStoreId(@PathVariable Long storeId) {
        List<TVDTO> tvs = tvService.getTVsByStoreId(storeId);
        return ResponseEntity.ok(tvs);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<TVDTO>> getTVsByBrand(@PathVariable String brand) {
        List<TVDTO> tvs = tvService.getTVsByBrand(brand);
        return ResponseEntity.ok(tvs);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<TVDTO> getTVBySerialNumber(@PathVariable String serialNumber) {
        TVDTO tv = tvService.getTVBySerialNumber(serialNumber);
        return ResponseEntity.ok(tv);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TVDTO> updateTV(@PathVariable Long id, @Valid @RequestBody TVDTO tvDTO) {
        TVDTO updatedTV = tvService.updateTV(id, tvDTO);
        return ResponseEntity.ok(updatedTV);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTV(@PathVariable Long id) {
        tvService.deleteTV(id);
        return ResponseEntity.noContent().build();
    }
}
