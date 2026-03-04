package com.salesmatrix.controller;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandRepository brandRepository;

    @GetMapping
    public ResponseEntity<List<BrandEntity>> getAllBrands(@RequestParam Long storeId) {
        List<BrandEntity> brands = brandRepository.findByStoreId(storeId);
        return ResponseEntity.ok(brands);
    }

    @PostMapping
    public ResponseEntity<BrandEntity> createBrand(@RequestBody BrandEntity brand) {
        BrandEntity savedBrand = brandRepository.save(brand);
        return new ResponseEntity<>(savedBrand, HttpStatus.CREATED);
    }
}