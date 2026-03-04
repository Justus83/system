package com.salesmatrix.controller;

import com.salesmatrix.entity.BeerSizeEntity;
import com.salesmatrix.repository.BeerSizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beer-sizes")
@RequiredArgsConstructor
public class BeerSizeController {

    private final BeerSizeRepository beerSizeRepository;

    @GetMapping
    public ResponseEntity<List<BeerSizeEntity>> getAllBeerSizes() {
        List<BeerSizeEntity> sizes = beerSizeRepository.findAll();
        return ResponseEntity.ok(sizes);
    }

    @PostMapping
    public ResponseEntity<BeerSizeEntity> createBeerSize(@RequestBody BeerSizeEntity size) {
        BeerSizeEntity savedSize = beerSizeRepository.save(size);
        return new ResponseEntity<>(savedSize, HttpStatus.CREATED);
    }
}