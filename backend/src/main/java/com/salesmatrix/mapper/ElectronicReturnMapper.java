package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicReturnDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.entity.ElectronicReturn;
import com.salesmatrix.entity.ElectronicSale;
import com.salesmatrix.enums.ReturnStatus;
import com.salesmatrix.repository.ElectronicProductRepository;
import com.salesmatrix.repository.ElectronicSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ElectronicReturnMapper {

    private final ElectronicSaleRepository electronicSaleRepository;
    private final ElectronicProductRepository electronicProductRepository;

    public ElectronicReturnDTO toDTO(ElectronicReturn entity) {
        if (entity == null) {
            return null;
        }

        ElectronicReturnDTO dto = ElectronicReturnDTO.builder()
                .id(entity.getId())
                .returnReason(entity.getReturnReason())
                .returnStatus(entity.getReturnStatus() != null ? entity.getReturnStatus().name() : null)
                .returnDate(entity.getReturnDate())
                .isReplacement(entity.getIsReplacement())
                .replacementDate(entity.getReplacementDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();

        // Set ElectronicSale info
        if (entity.getElectronicSale() != null) {
            dto.setElectronicSaleId(entity.getElectronicSale().getId());
            if (entity.getElectronicSale().getProduct() != null) {
                dto.setSaleProductName(entity.getElectronicSale().getProduct().getName());
                dto.setSaleProductSerialNumber(entity.getElectronicSale().getProduct().getSerialNumber());
            }
        }

        // Set returned product info
        if (entity.getReturnedProduct() != null) {
            dto.setReturnedProductId(entity.getReturnedProduct().getId());
            dto.setReturnedProductName(entity.getReturnedProduct().getName());
            dto.setReturnedProductSerialNumber(entity.getReturnedProduct().getSerialNumber());
        }

        // Set replacement product info
        if (entity.getReplacementProduct() != null) {
            dto.setReplacementProductId(entity.getReplacementProduct().getId());
            dto.setReplacementProductName(entity.getReplacementProduct().getName());
            dto.setReplacementProductSerialNumber(entity.getReplacementProduct().getSerialNumber());
        }

        return dto;
    }

    public ElectronicReturn toEntity(ElectronicReturnDTO dto) {
        if (dto == null) {
            return null;
        }

        ElectronicReturn entity = ElectronicReturn.builder()
                .id(dto.getId())
                .returnReason(dto.getReturnReason())
                .returnStatus(dto.getReturnStatus() != null ? ReturnStatus.valueOf(dto.getReturnStatus()) : null)
                .returnDate(dto.getReturnDate())
                .isReplacement(dto.getIsReplacement() != null ? dto.getIsReplacement() : false)
                .replacementDate(dto.getReplacementDate())
                .build();

        // Set ElectronicSale
        if (dto.getElectronicSaleId() != null) {
            ElectronicSale sale = electronicSaleRepository.findById(dto.getElectronicSaleId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicSale not found with id: " + dto.getElectronicSaleId()));
            entity.setElectronicSale(sale);
        }

        // Set returned product
        if (dto.getReturnedProductId() != null) {
            ElectronicProduct returnedProduct = electronicProductRepository.findById(dto.getReturnedProductId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicProduct not found with id: " + dto.getReturnedProductId()));
            entity.setReturnedProduct(returnedProduct);
        }

        // Set replacement product
        if (dto.getReplacementProductId() != null) {
            ElectronicProduct replacementProduct = electronicProductRepository.findById(dto.getReplacementProductId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicProduct not found with id: " + dto.getReplacementProductId()));
            entity.setReplacementProduct(replacementProduct);
        }

        return entity;
    }

    public List<ElectronicReturnDTO> toDTOList(List<ElectronicReturn> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ElectronicReturn> toEntityList(List<ElectronicReturnDTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    public void updateEntityFromDTO(ElectronicReturnDTO dto, ElectronicReturn entity) {
        if (dto == null || entity == null) {
            return;
        }

        entity.setReturnReason(dto.getReturnReason());
        if (dto.getReturnStatus() != null) {
            entity.setReturnStatus(ReturnStatus.valueOf(dto.getReturnStatus()));
        }
        entity.setReturnDate(dto.getReturnDate());
        entity.setIsReplacement(dto.getIsReplacement() != null ? dto.getIsReplacement() : entity.getIsReplacement());
        entity.setReplacementDate(dto.getReplacementDate());

        // Update ElectronicSale
        if (dto.getElectronicSaleId() != null && 
            (entity.getElectronicSale() == null || !dto.getElectronicSaleId().equals(entity.getElectronicSale().getId()))) {
            ElectronicSale sale = electronicSaleRepository.findById(dto.getElectronicSaleId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicSale not found with id: " + dto.getElectronicSaleId()));
            entity.setElectronicSale(sale);
        }

        // Update returned product
        if (dto.getReturnedProductId() != null && 
            (entity.getReturnedProduct() == null || !dto.getReturnedProductId().equals(entity.getReturnedProduct().getId()))) {
            ElectronicProduct returnedProduct = electronicProductRepository.findById(dto.getReturnedProductId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicProduct not found with id: " + dto.getReturnedProductId()));
            entity.setReturnedProduct(returnedProduct);
        }

        // Update replacement product
        if (dto.getReplacementProductId() != null) {
            ElectronicProduct replacementProduct = electronicProductRepository.findById(dto.getReplacementProductId())
                    .orElseThrow(() -> new IllegalArgumentException("ElectronicProduct not found with id: " + dto.getReplacementProductId()));
            entity.setReplacementProduct(replacementProduct);
        } else {
            entity.setReplacementProduct(null);
        }
    }
}
