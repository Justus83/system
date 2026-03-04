package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicShipmentDTO;
import com.salesmatrix.entity.ElectronicShipment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ElectronicShipmentMapper;
import com.salesmatrix.repository.ElectronicShipmentRepository;
import com.salesmatrix.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElectronicShipmentService {

    private final ElectronicShipmentRepository electronicShipmentRepository;
    private final StoreRepository storeRepository;
    private final ElectronicShipmentMapper electronicShipmentMapper;

    @Transactional
    public ElectronicShipmentDTO createShipment(ElectronicShipmentDTO shipmentDTO) {
        // Validate store if provided
        Store store = null;
        if (shipmentDTO.getStoreId() != null) {
            store = storeRepository.findById(shipmentDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + shipmentDTO.getStoreId()));
        }

        // Set default date if not provided
        if (shipmentDTO.getDate() == null) {
            shipmentDTO.setDate(LocalDateTime.now());
        }

        // Set default stock brought if not provided
        if (shipmentDTO.getStockBrought() == null) {
            shipmentDTO.setStockBrought(0);
        }

        ElectronicShipment shipment = electronicShipmentMapper.toEntity(shipmentDTO, store);
        ElectronicShipment savedShipment = electronicShipmentRepository.save(shipment);

        return electronicShipmentMapper.toDTO(savedShipment);
    }

    @Transactional(readOnly = true)
    public ElectronicShipmentDTO getShipmentById(Long id) {
        ElectronicShipment shipment = electronicShipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));
        return electronicShipmentMapper.toDTO(shipment);
    }

    @Transactional(readOnly = true)
    public List<ElectronicShipmentDTO> getAllShipments() {
        return electronicShipmentRepository.findAll().stream()
                .map(electronicShipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicShipmentDTO> getShipmentsByStoreId(Long storeId) {
        return electronicShipmentRepository.findByStoreId(storeId).stream()
                .map(electronicShipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ElectronicShipmentDTO> getShipmentsByInvoiceId(Long invoiceId) {
        return electronicShipmentRepository.findByInvoiceId(invoiceId).stream()
                .map(electronicShipmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ElectronicShipmentDTO updateShipment(Long id, ElectronicShipmentDTO shipmentDTO) {
        ElectronicShipment existingShipment = electronicShipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + id));

        // Update store if provided
        if (shipmentDTO.getStoreId() != null) {
            Store store = storeRepository.findById(shipmentDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + shipmentDTO.getStoreId()));
            existingShipment.setStore(store);
        }

        // Update fields
        if (shipmentDTO.getInvoiceId() != null) {
            existingShipment.setInvoiceId(shipmentDTO.getInvoiceId());
        }
        if (shipmentDTO.getDate() != null) {
            existingShipment.setDate(shipmentDTO.getDate());
        }
        if (shipmentDTO.getStockExpected() != null) {
            existingShipment.setStockExpected(shipmentDTO.getStockExpected());
        }
        if (shipmentDTO.getStockBrought() != null) {
            existingShipment.setStockBrought(shipmentDTO.getStockBrought());
        }

        ElectronicShipment updatedShipment = electronicShipmentRepository.save(existingShipment);
        return electronicShipmentMapper.toDTO(updatedShipment);
    }

    @Transactional
    public void deleteShipment(Long id) {
        if (!electronicShipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Shipment not found with id: " + id);
        }
        electronicShipmentRepository.deleteById(id);
    }
}
