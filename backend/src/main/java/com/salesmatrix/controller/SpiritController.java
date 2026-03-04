package com.salesmatrix.controller;

import com.salesmatrix.dto.SpiritDTO;
import com.salesmatrix.service.SpiritService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spirits")
@RequiredArgsConstructor
public class SpiritController {

    private final SpiritService spiritService;

    @PostMapping
    public ResponseEntity<SpiritDTO> createSpirit(@Valid @RequestBody SpiritDTO spiritDTO) {
        SpiritDTO createdSpirit = spiritService.createSpirit(spiritDTO);
        return new ResponseEntity<>(createdSpirit, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpiritDTO> getSpiritById(@PathVariable Long id) {
        SpiritDTO spirit = spiritService.getSpiritById(id);
        return ResponseEntity.ok(spirit);
    }

    @GetMapping
    public ResponseEntity<List<SpiritDTO>> getAllSpirits() {
        List<SpiritDTO> spirits = spiritService.getAllSpirits();
        return ResponseEntity.ok(spirits);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SpiritDTO>> getSpiritsByStoreId(@PathVariable Long storeId) {
        List<SpiritDTO> spirits = spiritService.getSpiritsByStoreId(storeId);
        return ResponseEntity.ok(spirits);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<SpiritDTO>> getSpiritsByBrand(@PathVariable String brand) {
        List<SpiritDTO> spirits = spiritService.getSpiritsByBrand(brand);
        return ResponseEntity.ok(spirits);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpiritDTO> updateSpirit(@PathVariable Long id, @Valid @RequestBody SpiritDTO spiritDTO) {
        SpiritDTO updatedSpirit = spiritService.updateSpirit(id, spiritDTO);
        return ResponseEntity.ok(updatedSpirit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpirit(@PathVariable Long id) {
        spiritService.deleteSpirit(id);
        return ResponseEntity.noContent().build();
    }
}
