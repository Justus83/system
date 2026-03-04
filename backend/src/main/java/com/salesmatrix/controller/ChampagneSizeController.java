package com.salesmatrix.controller;

import com.salesmatrix.entity.ChampagneSizeEntity;
import com.salesmatrix.repository.ChampagneSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/champagne-sizes")
@RequiredArgsConstructor
public class ChampagneSizeController {

    private final ChampagneSizeRepository champagneSizeRepository;

    @GetMapping
    public ResponseEntity<List<ChampagneSizeEntity>> getAllChampagneSizes() {
        return ResponseEntity.ok(champagneSizeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ChampagneSizeEntity> createChampagneSize(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (champagneSizeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        ChampagneSizeEntity champagneSize = ChampagneSizeEntity.builder()
                .name(name)
                .build();

        ChampagneSizeEntity saved = champagneSizeRepository.save(champagneSize);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
