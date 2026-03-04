package com.salesmatrix.controller;

import com.salesmatrix.entity.JuiceSizeEntity;
import com.salesmatrix.repository.JuiceSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/juice-sizes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JuiceSizeController {
    private final JuiceSizeRepository juiceSizeRepository;

    @GetMapping
    public ResponseEntity<List<JuiceSizeEntity>> getAllJuiceSizes() {
        return ResponseEntity.ok(juiceSizeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createJuiceSize(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        
        if (name == null || name.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Juice size name is required");
            return ResponseEntity.badRequest().body(error);
        }

        if (juiceSizeRepository.existsByName(name)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Juice size already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        JuiceSizeEntity juiceSize = JuiceSizeEntity.builder()
                .name(name)
                .build();
        
        JuiceSizeEntity saved = juiceSizeRepository.save(juiceSize);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
