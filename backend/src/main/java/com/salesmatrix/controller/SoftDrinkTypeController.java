package com.salesmatrix.controller;

import com.salesmatrix.entity.SoftDrinkTypeEntity;
import com.salesmatrix.repository.SoftDrinkTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/soft-drink-types")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SoftDrinkTypeController {
    private final SoftDrinkTypeRepository softDrinkTypeRepository;

    @GetMapping
    public ResponseEntity<List<SoftDrinkTypeEntity>> getAllTypes() {
        return ResponseEntity.ok(softDrinkTypeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createType(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Type name is required"));
        }

        if (softDrinkTypeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Type already exists"));
        }

        SoftDrinkTypeEntity type = SoftDrinkTypeEntity.builder()
                .name(name)
                .build();
        
        SoftDrinkTypeEntity saved = softDrinkTypeRepository.save(type);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
