package com.salesmatrix.controller;

import com.salesmatrix.dto.BarShiftDTO;
import com.salesmatrix.service.BarShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bar-shifts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BarShiftController {

    private final BarShiftService barShiftService;

    @PostMapping("/start")
    public ResponseEntity<BarShiftDTO> startShift(@Valid @RequestBody BarShiftDTO shiftDTO) {
        BarShiftDTO savedShift = barShiftService.startShift(shiftDTO);
        return ResponseEntity.ok(savedShift);
    }

    @PutMapping("/{id}/end")
    public ResponseEntity<BarShiftDTO> endShift(@PathVariable Long id, @Valid @RequestBody BarShiftDTO shiftDTO) {
        BarShiftDTO closedShift = barShiftService.endShift(id, shiftDTO);
        return ResponseEntity.ok(closedShift);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarShiftDTO> getShiftById(@PathVariable Long id) {
        BarShiftDTO shift = barShiftService.getShiftById(id);
        return ResponseEntity.ok(shift);
    }

    @GetMapping
    public ResponseEntity<List<BarShiftDTO>> getAllShifts() {
        List<BarShiftDTO> shifts = barShiftService.getAllShifts();
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/counter/{counterId}")
    public ResponseEntity<List<BarShiftDTO>> getShiftsByCounter(@PathVariable Long counterId) {
        List<BarShiftDTO> shifts = barShiftService.getShiftsByCounter(counterId);
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/counter/{counterId}/active")
    public ResponseEntity<BarShiftDTO> getActiveShiftByCounter(@PathVariable Long counterId) {
        BarShiftDTO shift = barShiftService.getActiveShiftByCounter(counterId);
        if (shift == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(shift);
    }

    @GetMapping("/counter/{counterId}/last-closed")
    public ResponseEntity<BarShiftDTO> getLastClosedShiftByCounter(@PathVariable Long counterId) {
        BarShiftDTO shift = barShiftService.getLastClosedShiftByCounter(counterId);
        if (shift == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(shift);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BarShiftDTO>> getShiftsByUser(@PathVariable Long userId) {
        List<BarShiftDTO> shifts = barShiftService.getShiftsByUser(userId);
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BarShiftDTO>> getShiftsByStore(@PathVariable Long storeId) {
        List<BarShiftDTO> shifts = barShiftService.getShiftsByStore(storeId);
        return ResponseEntity.ok(shifts);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<BarShiftDTO>> getShiftsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<BarShiftDTO> shifts = barShiftService.getShiftsByDateRange(startDate, endDate);
        return ResponseEntity.ok(shifts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        barShiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
