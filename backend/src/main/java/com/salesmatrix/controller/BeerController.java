package com.salesmatrix.controller;

import com.salesmatrix.dto.BeerDTO;
import com.salesmatrix.service.BeerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beers")
@RequiredArgsConstructor
public class BeerController {

    private final BeerService beerService;

    @PostMapping
    public ResponseEntity<BeerDTO> createBeer(@Valid @RequestBody BeerDTO beerDTO) {
        BeerDTO createdBeer = beerService.createBeer(beerDTO);
        return new ResponseEntity<>(createdBeer, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeerDTO> getBeerById(@PathVariable Long id) {
        BeerDTO beer = beerService.getBeerById(id);
        return ResponseEntity.ok(beer);
    }

    @GetMapping
    public ResponseEntity<List<BeerDTO>> getAllBeers() {
        List<BeerDTO> beers = beerService.getAllBeers();
        return ResponseEntity.ok(beers);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BeerDTO>> getBeersByStoreId(@PathVariable Long storeId) {
        List<BeerDTO> beers = beerService.getBeersByStoreId(storeId);
        return ResponseEntity.ok(beers);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<BeerDTO>> getBeersByBrand(@PathVariable String brand) {
        List<BeerDTO> beers = beerService.getBeersByBrand(brand);
        return ResponseEntity.ok(beers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BeerDTO> updateBeer(@PathVariable Long id, @Valid @RequestBody BeerDTO beerDTO) {
        BeerDTO updatedBeer = beerService.updateBeer(id, beerDTO);
        return ResponseEntity.ok(updatedBeer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Long id) {
        beerService.deleteBeer(id);
        return ResponseEntity.noContent().build();
    }
}
