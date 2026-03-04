package com.salesmatrix.controller;

import com.salesmatrix.dto.LaptopDTO;
import com.salesmatrix.service.LaptopService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laptops")
@RequiredArgsConstructor
public class LaptopController {

    private final LaptopService laptopService;

    @PostMapping
    public ResponseEntity<LaptopDTO> createLaptop(@Valid @RequestBody LaptopDTO laptopDTO) {
        LaptopDTO createdLaptop = laptopService.createLaptop(laptopDTO);
        return new ResponseEntity<>(createdLaptop, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LaptopDTO> getLaptopById(@PathVariable Long id) {
        LaptopDTO laptop = laptopService.getLaptopById(id);
        return ResponseEntity.ok(laptop);
    }

    @GetMapping
    public ResponseEntity<List<LaptopDTO>> getAllLaptops() {
        List<LaptopDTO> laptops = laptopService.getAllLaptops();
        return ResponseEntity.ok(laptops);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<LaptopDTO>> getLaptopsByStoreId(@PathVariable Long storeId) {
        List<LaptopDTO> laptops = laptopService.getLaptopsByStoreId(storeId);
        return ResponseEntity.ok(laptops);
    }

    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<LaptopDTO>> getLaptopsByBrand(@PathVariable String brand) {
        List<LaptopDTO> laptops = laptopService.getLaptopsByBrand(brand);
        return ResponseEntity.ok(laptops);
    }

    @GetMapping("/serial/{serialNumber}")
    public ResponseEntity<LaptopDTO> getLaptopBySerialNumber(@PathVariable String serialNumber) {
        LaptopDTO laptop = laptopService.getLaptopBySerialNumber(serialNumber);
        return ResponseEntity.ok(laptop);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LaptopDTO> updateLaptop(@PathVariable Long id, @Valid @RequestBody LaptopDTO laptopDTO) {
        LaptopDTO updatedLaptop = laptopService.updateLaptop(id, laptopDTO);
        return ResponseEntity.ok(updatedLaptop);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLaptop(@PathVariable Long id) {
        laptopService.deleteLaptop(id);
        return ResponseEntity.noContent().build();
    }
}
