package com.salesmatrix.controller;

import com.salesmatrix.dto.SoftDrinkDTO;
import com.salesmatrix.dto.SoftDrinkResponseDTO;
import com.salesmatrix.service.SoftDrinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soft-drinks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SoftDrinkController {
    private final SoftDrinkService softDrinkService;

    @PostMapping
    public ResponseEntity<SoftDrinkResponseDTO> createSoftDrink(@RequestBody SoftDrinkDTO softDrinkDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(softDrinkService.createSoftDrink(softDrinkDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SoftDrinkResponseDTO> updateSoftDrink(
            @PathVariable Long id,
            @RequestBody SoftDrinkDTO softDrinkDTO) {
        return ResponseEntity.ok(softDrinkService.updateSoftDrink(id, softDrinkDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSoftDrink(@PathVariable Long id) {
        softDrinkService.deleteSoftDrink(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SoftDrinkResponseDTO> getSoftDrinkById(@PathVariable Long id) {
        return ResponseEntity.ok(softDrinkService.getSoftDrinkById(id));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SoftDrinkResponseDTO>> getSoftDrinksByStore(@PathVariable Long storeId) {
        return ResponseEntity.ok(softDrinkService.getSoftDrinksByStore(storeId));
    }
}
