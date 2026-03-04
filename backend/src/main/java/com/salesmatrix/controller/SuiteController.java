package com.salesmatrix.controller;

import com.salesmatrix.dto.SuiteDTO;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.service.SuiteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suites")
@RequiredArgsConstructor
public class SuiteController {

    private final SuiteService suiteService;

    @PostMapping
    public ResponseEntity<SuiteDTO> createSuite(@Valid @RequestBody SuiteDTO suiteDTO) {
        return new ResponseEntity<>(suiteService.createSuite(suiteDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuiteDTO> getSuiteById(@PathVariable Long id) {
        return ResponseEntity.ok(suiteService.getSuiteById(id));
    }

    @GetMapping
    public ResponseEntity<List<SuiteDTO>> getAllSuites() {
        return ResponseEntity.ok(suiteService.getAllSuites());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SuiteDTO>> getSuitesByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(suiteService.getSuitesByStoreId(storeId));
    }

    @GetMapping("/apartment/{apartmentId}")
    public ResponseEntity<List<SuiteDTO>> getSuitesByApartmentId(@PathVariable Long apartmentId) {
        return ResponseEntity.ok(suiteService.getSuitesByApartmentId(apartmentId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SuiteDTO>> getSuitesByStatus(@PathVariable RentalStatus status) {
        return ResponseEntity.ok(suiteService.getSuitesByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiteDTO> updateSuite(@PathVariable Long id, @Valid @RequestBody SuiteDTO suiteDTO) {
        return ResponseEntity.ok(suiteService.updateSuite(id, suiteDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSuite(@PathVariable Long id) {
        suiteService.deleteSuite(id);
        return ResponseEntity.noContent().build();
    }
}
