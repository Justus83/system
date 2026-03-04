package com.salesmatrix.controller;

import com.salesmatrix.entity.WineSizeEntity;
import com.salesmatrix.repository.WineSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wine-sizes")
@RequiredArgsConstructor
public class WineSizeController {

    private final WineSizeRepository wineSizeRepository;

    @GetMapping
    public ResponseEntity<List<WineSizeEntity>> getAllWineSizes() {
        return ResponseEntity.ok(wineSizeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<WineSizeEntity> createWineSize(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        if (wineSizeRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        WineSizeEntity wineSize = WineSizeEntity.builder()
                .name(name)
                .build();

        WineSizeEntity saved = wineSizeRepository.save(wineSize);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
