package com.salesmatrix.controller;

import com.salesmatrix.entity.SpiritSizeEntity;
import com.salesmatrix.repository.SpiritSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spirit-sizes")
@RequiredArgsConstructor
public class SpiritSizeController {

    private final SpiritSizeRepository spiritSizeRepository;

    @GetMapping
    public ResponseEntity<List<SpiritSizeEntity>> getAllSpiritSizes() {
        return ResponseEntity.ok(spiritSizeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SpiritSizeEntity> createSpiritSize(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if already exists
        if (spiritSizeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        SpiritSizeEntity spiritSize = SpiritSizeEntity.builder()
                .name(name)
                .build();

        SpiritSizeEntity saved = spiritSizeRepository.save(spiritSize);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
