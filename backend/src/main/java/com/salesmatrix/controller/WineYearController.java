package com.salesmatrix.controller;

import com.salesmatrix.entity.WineYearEntity;
import com.salesmatrix.repository.WineYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wine-years")
@RequiredArgsConstructor
public class WineYearController {

    private final WineYearRepository wineYearRepository;

    @GetMapping
    public ResponseEntity<List<WineYearEntity>> getAllWineYears() {
        return ResponseEntity.ok(wineYearRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<WineYearEntity> createWineYear(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (wineYearRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        WineYearEntity wineYear = WineYearEntity.builder()
                .name(name)
                .build();

        WineYearEntity saved = wineYearRepository.save(wineYear);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
