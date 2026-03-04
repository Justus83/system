package com.salesmatrix.controller;

import com.salesmatrix.dto.HostelRoomDTO;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.service.HostelRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostel-rooms")
@RequiredArgsConstructor
public class HostelRoomController {

    private final HostelRoomService hostelRoomService;

    @PostMapping
    public ResponseEntity<HostelRoomDTO> createHostelRoom(@Valid @RequestBody HostelRoomDTO hostelRoomDTO) {
        return new ResponseEntity<>(hostelRoomService.createHostelRoom(hostelRoomDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostelRoomDTO> getHostelRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(hostelRoomService.getHostelRoomById(id));
    }

    @GetMapping
    public ResponseEntity<List<HostelRoomDTO>> getAllHostelRooms() {
        return ResponseEntity.ok(hostelRoomService.getAllHostelRooms());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<HostelRoomDTO>> getHostelRoomsByStoreId(@PathVariable Long storeId) {
        return ResponseEntity.ok(hostelRoomService.getHostelRoomsByStoreId(storeId));
    }

    @GetMapping("/hostel/{hostelId}")
    public ResponseEntity<List<HostelRoomDTO>> getHostelRoomsByHostelId(@PathVariable Long hostelId) {
        return ResponseEntity.ok(hostelRoomService.getHostelRoomsByHostelId(hostelId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<HostelRoomDTO>> getHostelRoomsByStatus(@PathVariable RentalStatus status) {
        return ResponseEntity.ok(hostelRoomService.getHostelRoomsByStatus(status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostelRoomDTO> updateHostelRoom(@PathVariable Long id, @Valid @RequestBody HostelRoomDTO hostelRoomDTO) {
        return ResponseEntity.ok(hostelRoomService.updateHostelRoom(id, hostelRoomDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHostelRoom(@PathVariable Long id) {
        hostelRoomService.deleteHostelRoom(id);
        return ResponseEntity.noContent().build();
    }
}
