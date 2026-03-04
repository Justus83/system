package com.salesmatrix.controller;

import com.salesmatrix.dto.WineDTO;
import com.salesmatrix.dto.WineResponseDTO;
import com.salesmatrix.service.WineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wines")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @PostMapping
    public ResponseEntity<WineResponseDTO> createWine(@Valid @RequestBody WineDTO wineDTO) {
        WineResponseDTO created = wineService.createWine(wineDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WineResponseDTO> updateWine(@PathVariable Long id, @Valid @RequestBody WineDTO wineDTO) {
        WineResponseDTO updated = wineService.updateWine(id, wineDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWine(@PathVariable Long id) {
        wineService.deleteWine(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WineResponseDTO> getWineById(@PathVariable Long id) {
        WineResponseDTO wine = wineService.getWineById(id);
        return ResponseEntity.ok(wine);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<WineResponseDTO>> getWinesByStore(@PathVariable Long storeId) {
        List<WineResponseDTO> wines = wineService.getWinesByStore(storeId);
        return ResponseEntity.ok(wines);
    }
}
