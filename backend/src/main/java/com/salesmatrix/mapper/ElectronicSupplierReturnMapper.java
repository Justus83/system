package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicSupplierReturnDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.entity.ElectronicSupplierReturn;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import com.salesmatrix.repository.ElectronicProductRepository;
import com.salesmatrix.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ElectronicSupplierReturnMapper {

    private final SupplierRepository supplierRepository;
    private final ElectronicProductRepository electronicProductRepository;

    public ElectronicSupplierReturnDTO toDTO(ElectronicSupplierReturn entity) {
        if (entity == null) {
            return null;
        }

        ElectronicSupplierReturnDTO dto = ElectronicSupplierReturnDTO.builder()
                .id(entity.getId())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .returnDate(entity.getReturnDate())
                .productValue(entity.getProductValue())
                .returnReason(entity.getReturnReason())
                .replacementSerialNumber(entity.getReplacementSerialNumber())
                .replacementReason(entity.getReplacementReason())
                .replacementDate(entity.getReplacementDate())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();

        // Set Supplier info (may be null for OTHER source type)
        if (entity.getSupplier() != null) {
            dto.setSupplierId(entity.getSupplier().getId());
            dto.setSupplierName(entity.getSupplier().getName());
        } else if (entity.getElectronicProduct() != null && 
                   entity.getElectronicProduct().getSourceType() == com.salesmatrix.enums.SourceType.OTHER) {
            // For OTHER source type, show the other source name as supplier name
            dto.setSupplierName(entity.getElectronicProduct().getOtherSourceName() + " (Other Source)");
        }

        // Set ElectronicProduct info
        if (entity.getElectronicProduct() != null) {
            dto.setElectronicProductId(entity.getElectronicProduct().getId());
            dto.setProductName(entity.getElectronicProduct().getName());
            dto.setProductSerialNumber(entity.getElectronicProduct().getSerialNumber());
        }

        return dto;
    }

    public ElectronicSupplierReturn toEntity(ElectronicSupplierReturnDTO dto) {
        if (dto == null) {
            return null;
        }

        ElectronicSupplierReturn entity = ElectronicSupplierReturn.builder()
                .id(dto.getId())
                .status(dto.getStatus() != null ? ElectronicSupplierReturnStatus.valueOf(dto.getStatus()) : null)
                .returnDate(dto.getReturnDate())
                .productValue(dto.getProductValue())
                .returnReason(dto.getReturnReason())
                .replacementSerialNumber(dto.getReplacementSerialNumber())
                .replacementReason(dto.getReplacementReason())
                .replacementDate(dto.getReplacementDate())
                .notes(dto.getNotes())
                .build();

        // Set Supplier
        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElse(null);
            entity.setSupplier(supplier);
        }

        // Set ElectronicProduct
        if (dto.getElectronicProductId() != null) {
            ElectronicProduct product = electronicProductRepository.findById(dto.getElectronicProductId())
                    .orElse(null);
            entity.setElectronicProduct(product);
        }

        return entity;
    }

    public void updateEntityFromDTO(ElectronicSupplierReturnDTO dto, ElectronicSupplierReturn entity) {
        if (dto == null || entity == null) {
            return;
        }

        if (dto.getStatus() != null) {
            entity.setStatus(ElectronicSupplierReturnStatus.valueOf(dto.getStatus()));
        }
        if (dto.getReturnDate() != null) {
            entity.setReturnDate(dto.getReturnDate());
        }
        if (dto.getProductValue() != null) {
            entity.setProductValue(dto.getProductValue());
        }
        if (dto.getReturnReason() != null) {
            entity.setReturnReason(dto.getReturnReason());
        }
        if (dto.getReplacementSerialNumber() != null) {
            entity.setReplacementSerialNumber(dto.getReplacementSerialNumber());
        }
        if (dto.getReplacementReason() != null) {
            entity.setReplacementReason(dto.getReplacementReason());
        }
        if (dto.getReplacementDate() != null) {
            entity.setReplacementDate(dto.getReplacementDate());
        }
        if (dto.getNotes() != null) {
            entity.setNotes(dto.getNotes());
        }

        // Update Supplier
        if (dto.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElse(null);
            entity.setSupplier(supplier);
        }

        // Update ElectronicProduct
        if (dto.getElectronicProductId() != null) {
            ElectronicProduct product = electronicProductRepository.findById(dto.getElectronicProductId())
                    .orElse(null);
            entity.setElectronicProduct(product);
        }
    }

    public List<ElectronicSupplierReturnDTO> toDTOList(List<ElectronicSupplierReturn> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ElectronicSupplierReturn> toEntityList(List<ElectronicSupplierReturnDTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
