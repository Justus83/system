package com.salesmatrix.mapper;

import com.salesmatrix.dto.BarShiftDTO;
import com.salesmatrix.dto.BarShiftStockDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.repository.BarInventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BarShiftMapper {

    private final BarInventoryRepository barInventoryRepository;

    public BarShift toEntity(BarShiftDTO dto, BarCounter counter, User user) {
        return BarShift.builder()
                .id(dto.getId())
                .counter(counter)
                .user(user)
                .shiftStart(dto.getShiftStart())
                .shiftEnd(dto.getShiftEnd())
                .openingCash(dto.getOpeningCash())
                .closingCash(dto.getClosingCash())
                .expectedClosingCash(dto.getExpectedClosingCash())
                .cashVariance(dto.getCashVariance())
                .totalSales(dto.getTotalSales())
                .totalExpenses(dto.getTotalExpenses())
                .status(dto.getStatus())
                .notes(dto.getNotes())
                .verifiedByNextShift(dto.getVerifiedByNextShift())
                .discrepancyNotes(dto.getDiscrepancyNotes())
                .build();
    }

    public BarShiftDTO toDTO(BarShift shift, List<BarShiftStock> stockItems) {
        return BarShiftDTO.builder()
                .id(shift.getId())
                .counterId(shift.getCounter().getId())
                .counterName(shift.getCounter().getName())
                .userId(shift.getUser().getId())
                .username(shift.getUser().getUsername())
                .shiftStart(shift.getShiftStart())
                .shiftEnd(shift.getShiftEnd())
                .openingCash(shift.getOpeningCash())
                .closingCash(shift.getClosingCash())
                .expectedClosingCash(shift.getExpectedClosingCash())
                .cashVariance(shift.getCashVariance())
                .totalSales(shift.getTotalSales())
                .totalExpenses(shift.getTotalExpenses())
                .status(shift.getStatus())
                .notes(shift.getNotes())
                .verifiedByNextShift(shift.getVerifiedByNextShift())
                .discrepancyNotes(shift.getDiscrepancyNotes())
                .stockItems(stockItems.stream().map(this::toStockDTO).collect(Collectors.toList()))
                .build();
    }

    public BarShiftStock toStockEntity(BarShiftStockDTO dto, BarShift shift) {
        String productName = dto.getProductName();
        
        // If product name not provided, fetch from inventory
        if (productName == null || productName.isEmpty()) {
            productName = getProductNameFromInventory(dto.getProductId(), dto.getProductType());
        }

        return BarShiftStock.builder()
                .id(dto.getId())
                .shift(shift)
                .productType(dto.getProductType())
                .productId(dto.getProductId())
                .productName(productName)
                .openingQuantity(dto.getOpeningQuantity())
                .closingQuantity(dto.getClosingQuantity())
                .expectedClosingQuantity(dto.getExpectedClosingQuantity())
                .quantityVariance(dto.getQuantityVariance())
                .isOpening(dto.getIsOpening())
                .build();
    }

    public BarShiftStockDTO toStockDTO(BarShiftStock stock) {
        return BarShiftStockDTO.builder()
                .id(stock.getId())
                .productType(stock.getProductType())
                .productId(stock.getProductId())
                .productName(stock.getProductName())
                .openingQuantity(stock.getOpeningQuantity())
                .closingQuantity(stock.getClosingQuantity())
                .expectedClosingQuantity(stock.getExpectedClosingQuantity())
                .quantityVariance(stock.getQuantityVariance())
                .isOpening(stock.getIsOpening())
                .build();
    }

    private String getProductNameFromInventory(Long productId, BarInventory.ProductType productType) {
        // This is a simplified version - you might want to fetch actual product details
        return productType.toString() + " #" + productId;
    }
}
