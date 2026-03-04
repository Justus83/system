package com.salesmatrix.controller;

import com.salesmatrix.dto.RentalHouseDTO;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.service.RentalHouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rental-houses")
@RequiredArgsConstructor
public class RentalHouseController {

    private final RentalHouseService rentalHouseService;

    @PostMapping
    public ResponseEntity<RentalHouseDTO> createRentalHouse(@Valid @RequestBody RentalHouseDTO rentalHouseDTO) {
        return new ResponseEntity<>(rentalHouseService.createRentalHouse(rentalHouseDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RentalHouseDTO> getRentalHouseById(@PathVariable Long id) {
        return ResponseEntity.ok(rentalHouseService.getRentalHouseById(id));
    }

    @GetMapping
    public ResponseEntity<List<RentalHouseDTO>> getAllRentalHouses() {
        return ResponseEntity.ok(rentalHouseService.getAllRentalHouses());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<RentalHouseDTO>> getRentalHousesByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(rentalHouseService.getRentalHousesByStoreId(storeId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<RentalHouseDTO>> getRentalHousesByLandlordId(@PathVariable Long landlordId) {
        return ResponseEntity.ok(rentalHouseService.getRentalHousesByLandlordId(landlordId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RentalHouseDTO>> getRentalHousesByStatus(@PathVariable RentalStatus status) {
        return ResponseEntity.ok(rentalHouseService.getRentalHousesByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RentalHouseDTO> updateRentalHouse(@PathVariable Long id, @Valid @RequestBody RentalHouseDTO rentalHouseDTO) {
        return ResponseEntity.ok(rentalHouseService.updateRentalHouse(id, rentalHouseDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRentalHouse(@PathVariable Long id) {
        rentalHouseService.deleteRentalHouse(id);
        return ResponseEntity.noContent().build();
    }
}
