package com.salesmatrix.controller;

import com.salesmatrix.entity.PackagingEntity;
import com.salesmatrix.repository.PackagingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/packaging")
@RequiredArgsConstructor
public class PackagingController {

    private final PackagingRepository packagingRepository;

    @GetMapping
    public ResponseEntity<List<PackagingEntity>> getAllPackaging() {
        List<PackagingEntity> packaging = packagingRepository.findAll();
        return ResponseEntity.ok(packaging);
    }

    @PostMapping
    public ResponseEntity<PackagingEntity> createPackaging(@RequestBody PackagingEntity packaging) {
        PackagingEntity savedPackaging = packagingRepository.save(packaging);
        return new ResponseEntity<>(savedPackaging, HttpStatus.CREATED);
    }
}