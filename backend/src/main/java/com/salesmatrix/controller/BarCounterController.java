package com.salesmatrix.controller;

import com.salesmatrix.dto.BarCounterDTO;
import com.salesmatrix.service.BarCounterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/counters")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BarCounterController {

    private final BarCounterService barCounterService;

    @PostMapping
    public ResponseEntity<BarCounterDTO> createCounter(@Valid @RequestBody BarCounterDTO counterDTO) {
        BarCounterDTO savedCounter = barCounterService.createCounter(counterDTO);
        return ResponseEntity.ok(savedCounter);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarCounterDTO> getCounterById(@PathVariable Long id) {
        BarCounterDTO counter = barCounterService.getCounterById(id);
        return ResponseEntity.ok(counter);
    }

    @GetMapping
    public ResponseEntity<List<BarCounterDTO>> getAllCounters() {
        List<BarCounterDTO> counters = barCounterService.getAllCounters();
        return ResponseEntity.ok(counters);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BarCounterDTO>> getCountersByStore(@PathVariable Long storeId) {
        List<BarCounterDTO> counters = barCounterService.getCountersByStoreId(storeId);
        return ResponseEntity.ok(counters);
    }

    @GetMapping("/store/{storeId}/active")
    public ResponseEntity<List<BarCounterDTO>> getActiveCountersByStore(@PathVariable Long storeId) {
        List<BarCounterDTO> counters = barCounterService.getActiveCountersByStoreId(storeId);
        return ResponseEntity.ok(counters);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BarCounterDTO> updateCounter(
            @PathVariable Long id,
            @Valid @RequestBody BarCounterDTO counterDTO) {
        BarCounterDTO updatedCounter = barCounterService.updateCounter(id, counterDTO);
        return ResponseEntity.ok(updatedCounter);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCounter(@PathVariable Long id) {
        barCounterService.deleteCounter(id);
        return ResponseEntity.noContent().build();
    }
}
