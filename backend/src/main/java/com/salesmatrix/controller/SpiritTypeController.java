package com.salesmatrix.controller;

import com.salesmatrix.entity.SpiritTypeEntity;
import com.salesmatrix.repository.SpiritTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spirit-types")
@RequiredArgsConstructor
public class SpiritTypeController {

    private final SpiritTypeRepository spiritTypeRepository;

    @GetMapping
    public ResponseEntity<List<SpiritTypeEntity>> getAllSpiritTypes() {
        return ResponseEntity.ok(spiritTypeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SpiritTypeEntity> createSpiritType(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if already exists
        if (spiritTypeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        SpiritTypeEntity spiritType = new SpiritTypeEntity();
        spiritType.setName(name);

        SpiritTypeEntity saved = spiritTypeRepository.save(spiritType);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
