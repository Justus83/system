package com.salesmatrix.controller;

import com.salesmatrix.entity.WineTypeEntity;
import com.salesmatrix.repository.WineTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wine-types")
@RequiredArgsConstructor
public class WineTypeController {

    private final WineTypeRepository wineTypeRepository;

    @GetMapping
    public ResponseEntity<List<WineTypeEntity>> getAllWineTypes() {
        return ResponseEntity.ok(wineTypeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<WineTypeEntity> createWineType(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (wineTypeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        WineTypeEntity wineType = new WineTypeEntity();
        wineType.setName(name);

        WineTypeEntity saved = wineTypeRepository.save(wineType);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
