package com.salesmatrix.mapper;

import com.salesmatrix.dto.BarSaleDTO;
import com.salesmatrix.dto.BarSaleItemDTO;
import com.salesmatrix.entity.BarCounter;
import com.salesmatrix.entity.BarSale;
import com.salesmatrix.entity.BarSaleItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BarSaleMapper {

    public BarSaleDTO toDTO(BarSale sale, List<BarSaleItem> items) {
        List<BarSaleItemDTO> itemDTOs = items.stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        return BarSaleDTO.builder()
                .id(sale.getId())
                .counterId(sale.getCounter().getId())
                .counterName(sale.getCounter().getName())
                .saleDate(sale.getSaleDate())
                .totalAmount(sale.getTotalAmount())
                .paymentMethod(sale.getPaymentMethod())
                .customerName(sale.getCustomerName())
                .notes(sale.getNotes())
                .servedBy(sale.getServedBy())
                .items(itemDTOs)
                .build();
    }

    public BarSale toEntity(BarSaleDTO dto, BarCounter counter) {
        return BarSale.builder()
                .counter(counter)
                .saleDate(dto.getSaleDate())
                .totalAmount(dto.getTotalAmount())
                .paymentMethod(dto.getPaymentMethod())
                .customerName(dto.getCustomerName())
                .notes(dto.getNotes())
                .servedBy(dto.getServedBy())
                .build();
    }

    public BarSaleItem toItemEntity(BarSaleItemDTO dto, BarSale sale) {
        return BarSaleItem.builder()
                .sale(sale)
                .productType(dto.getProductType())
                .productId(dto.getProductId())
                .productName(dto.getProductName())
                .quantity(dto.getQuantity())
                .unitPrice(dto.getUnitPrice())
                .totalPrice(dto.getTotalPrice())
                .build();
    }

    public BarSaleItemDTO toItemDTO(BarSaleItem item) {
        return BarSaleItemDTO.builder()
                .id(item.getId())
                .productType(item.getProductType())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
