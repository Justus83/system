package com.salesmatrix.controller;

import com.salesmatrix.dto.ApartmentDTO;
import com.salesmatrix.service.ApartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @PostMapping
    public ResponseEntity<ApartmentDTO> createApartment(@Valid @RequestBody ApartmentDTO apartmentDTO) {
        return new ResponseEntity<>(apartmentService.createApartment(apartmentDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApartmentDTO> getApartmentById(@PathVariable Long id) {
        return ResponseEntity.ok(apartmentService.getApartmentById(id));
    }

    @GetMapping
    public ResponseEntity<List<ApartmentDTO>> getAllApartments() {
        return ResponseEntity.ok(apartmentService.getAllApartments());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ApartmentDTO>> getApartmentsByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(apartmentService.getApartmentsByStoreId(storeId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<ApartmentDTO>> getApartmentsByLandlordId(@PathVariable Long landlordId) {
        return ResponseEntity.ok(apartmentService.getApartmentsByLandlordId(landlordId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApartmentDTO> updateApartment(@PathVariable Long id, @Valid @RequestBody ApartmentDTO apartmentDTO) {
        return ResponseEntity.ok(apartmentService.updateApartment(id, apartmentDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable Long id) {
        apartmentService.deleteApartment(id);
        return ResponseEntity.noContent().build();
    }
}
