package com.salesmatrix.controller;

import com.salesmatrix.dto.ChampagneDTO;
import com.salesmatrix.dto.ChampagneResponseDTO;
import com.salesmatrix.service.ChampagneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/champagnes")
@RequiredArgsConstructor
public class ChampagneController {

    private final ChampagneService champagneService;

    @PostMapping
    public ResponseEntity<ChampagneResponseDTO> createChampagne(@Valid @RequestBody ChampagneDTO champagneDTO) {
        ChampagneResponseDTO created = champagneService.createChampagne(champagneDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChampagneResponseDTO> updateChampagne(@PathVariable Long id, @Valid @RequestBody ChampagneDTO champagneDTO) {
        ChampagneResponseDTO updated = champagneService.updateChampagne(id, champagneDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChampagne(@PathVariable Long id) {
        champagneService.deleteChampagne(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChampagneResponseDTO> getChampagneById(@PathVariable Long id) {
        ChampagneResponseDTO champagne = champagneService.getChampagneById(id);
        return ResponseEntity.ok(champagne);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ChampagneResponseDTO>> getChampagnesByStore(@PathVariable Long storeId) {
        List<ChampagneResponseDTO> champagnes = champagneService.getChampagnesByStore(storeId);
        return ResponseEntity.ok(champagnes);
    }
}
