package com.salesmatrix.controller;

import com.salesmatrix.entity.SpiritYearEntity;
import com.salesmatrix.repository.SpiritYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/spirit-years")
@RequiredArgsConstructor
public class SpiritYearController {

    private final SpiritYearRepository spiritYearRepository;

    @GetMapping
    public ResponseEntity<List<SpiritYearEntity>> getAllSpiritYears() {
        return ResponseEntity.ok(spiritYearRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<SpiritYearEntity> createSpiritYear(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Check if already exists
        if (spiritYearRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        SpiritYearEntity spiritYear = SpiritYearEntity.builder()
                .name(name)
                .build();

        SpiritYearEntity saved = spiritYearRepository.save(spiritYear);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
