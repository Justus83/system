package com.salesmatrix.controller;

import com.salesmatrix.entity.SoftDrinkSizeEntity;
import com.salesmatrix.repository.SoftDrinkSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/soft-drink-sizes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SoftDrinkSizeController {
    private final SoftDrinkSizeRepository softDrinkSizeRepository;

    @GetMapping
    public ResponseEntity<List<SoftDrinkSizeEntity>> getAllSizes() {
        return ResponseEntity.ok(softDrinkSizeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createSize(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Size name is required"));
        }

        if (softDrinkSizeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Size already exists"));
        }

        SoftDrinkSizeEntity size = SoftDrinkSizeEntity.builder()
                .name(name)
                .build();
        
        SoftDrinkSizeEntity saved = softDrinkSizeRepository.save(size);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
