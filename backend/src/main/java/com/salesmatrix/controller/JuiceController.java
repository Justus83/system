package com.salesmatrix.controller;

import com.salesmatrix.dto.JuiceDTO;
import com.salesmatrix.dto.JuiceResponseDTO;
import com.salesmatrix.service.JuiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/juices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JuiceController {
    private final JuiceService juiceService;

    @PostMapping
    public ResponseEntity<JuiceResponseDTO> createJuice(@RequestBody JuiceDTO juiceDTO) {
        JuiceResponseDTO created = juiceService.createJuice(juiceDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JuiceResponseDTO> updateJuice(@PathVariable Long id, @RequestBody JuiceDTO juiceDTO) {
        JuiceResponseDTO updated = juiceService.updateJuice(id, juiceDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJuice(@PathVariable Long id) {
        juiceService.deleteJuice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JuiceResponseDTO> getJuiceById(@PathVariable Long id) {
        JuiceResponseDTO juice = juiceService.getJuiceById(id);
        return ResponseEntity.ok(juice);
    }

    @GetMapping
    public ResponseEntity<List<JuiceResponseDTO>> getAllJuices() {
        List<JuiceResponseDTO> juices = juiceService.getAllJuices();
        return ResponseEntity.ok(juices);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<JuiceResponseDTO>> getJuicesByStore(@PathVariable Long storeId) {
        List<JuiceResponseDTO> juices = juiceService.getJuicesByStore(storeId);
        return ResponseEntity.ok(juices);
    }
}
