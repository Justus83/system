package com.salesmatrix.controller;

import com.salesmatrix.dto.ElectronicShipmentDTO;
import com.salesmatrix.service.ElectronicShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ElectronicShipmentController {

    private final ElectronicShipmentService electronicShipmentService;

    @PostMapping
    public ResponseEntity<ElectronicShipmentDTO> createShipment(@RequestBody ElectronicShipmentDTO shipmentDTO) {
        ElectronicShipmentDTO createdShipment = electronicShipmentService.createShipment(shipmentDTO);
        return new ResponseEntity<>(createdShipment, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectronicShipmentDTO> getShipmentById(@PathVariable Long id) {
        ElectronicShipmentDTO shipment = electronicShipmentService.getShipmentById(id);
        return ResponseEntity.ok(shipment);
    }

    @GetMapping
    public ResponseEntity<List<ElectronicShipmentDTO>> getAllShipments() {
        List<ElectronicShipmentDTO> shipments = electronicShipmentService.getAllShipments();
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ElectronicShipmentDTO>> getShipmentsByStoreId(@PathVariable Long storeId) {
        List<ElectronicShipmentDTO> shipments = electronicShipmentService.getShipmentsByStoreId(storeId);
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<ElectronicShipmentDTO>> getShipmentsByInvoiceId(@PathVariable Long invoiceId) {
        List<ElectronicShipmentDTO> shipments = electronicShipmentService.getShipmentsByInvoiceId(invoiceId);
        return ResponseEntity.ok(shipments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElectronicShipmentDTO> updateShipment(
            @PathVariable Long id,
            @RequestBody ElectronicShipmentDTO shipmentDTO) {
        ElectronicShipmentDTO updatedShipment = electronicShipmentService.updateShipment(id, shipmentDTO);
        return ResponseEntity.ok(updatedShipment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable Long id) {
        electronicShipmentService.deleteShipment(id);
        return ResponseEntity.noContent().build();
    }
}
