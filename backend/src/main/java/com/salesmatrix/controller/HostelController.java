package com.salesmatrix.controller;

import com.salesmatrix.dto.HostelDTO;
import com.salesmatrix.service.HostelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@RequiredArgsConstructor
public class HostelController {

    private final HostelService hostelService;

    @PostMapping
    public ResponseEntity<HostelDTO> createHostel(@Valid @RequestBody HostelDTO hostelDTO) {
        return new ResponseEntity<>(hostelService.createHostel(hostelDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelDTO> getHostelById(@PathVariable Long id) {
        return ResponseEntity.ok(hostelService.getHostelById(id));
    }

    @GetMapping
    public ResponseEntity<List<HostelDTO>> getAllHostels() {
        return ResponseEntity.ok(hostelService.getAllHostels());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<HostelDTO>> getHostelsByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(hostelService.getHostelsByStoreId(storeId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<HostelDTO>> getHostelsByLandlordId(@PathVariable Long landlordId) {
        return ResponseEntity.ok(hostelService.getHostelsByLandlordId(landlordId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelDTO> updateHostel(@PathVariable Long id, @Valid @RequestBody HostelDTO hostelDTO) {
        return ResponseEntity.ok(hostelService.updateHostel(id, hostelDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHostel(@PathVariable Long id) {
        hostelService.deleteHostel(id);
        return ResponseEntity.noContent().build();
    }
}
