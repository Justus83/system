package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicInvestmentDTO;
import com.salesmatrix.entity.ElectronicInvestment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ElectronicInvestmentMapper {

    public ElectronicInvestmentDTO toDTO(ElectronicInvestment investment) {
        if (investment == null) {
            return null;
        }

        return ElectronicInvestmentDTO.builder()
                .id(investment.getId())
                .invoiceNumber(investment.getInvoiceNumber())
                .productDetails(investment.getProductDetails())
                .investmentDate(investment.getInvestmentDate())
                .totalItems(investment.getTotalItems())
                .itemsRemaining(investment.getItemsRemaining())
                .totalAmount(investment.getTotalAmount())
                .balance(investment.getBalance())
                .amountPaid(investment.getAmountPaid())
                .status(investment.getStatus() != null ? investment.getStatus().name().toLowerCase() : null)
                .notes(investment.getNotes())
                .createdBy(investment.getCreatedBy())
                .createdAt(investment.getCreatedAt())
                .updatedAt(investment.getUpdatedAt())
                .supplierId(investment.getSupplier() != null ? investment.getSupplier().getId() : null)
                .supplierName(investment.getSupplier() != null ? investment.getSupplier().getName() : null)
                .storeId(investment.getStore() != null ? investment.getStore().getId() : null)
                .storeName(investment.getStore() != null ? investment.getStore().getName() : null)
                .totalQuantity(investment.getTotalQuantity())
                .itemsReceived(investment.getItemsReceived())
                .productCondition(investment.getProductCondition() != null ? investment.getProductCondition().name().toLowerCase() : null)
                .build();
    }

    public ElectronicInvestment toEntity(ElectronicInvestmentDTO dto, Supplier supplier, Store store) {
        if (dto == null) {
            return null;
        }

        return ElectronicInvestment.builder()
                .id(dto.getId())
                .invoiceNumber(dto.getInvoiceNumber())
                .productDetails(dto.getProductDetails())
                .investmentDate(dto.getInvestmentDate())
                .totalItems(dto.getTotalItems() != null ? dto.getTotalItems() : 0)
                .itemsRemaining(dto.getItemsRemaining() != null ? dto.getItemsRemaining() : 0)
                .totalAmount(dto.getTotalAmount() != null ? dto.getTotalAmount() : java.math.BigDecimal.ZERO)
                .balance(dto.getBalance() != null ? dto.getBalance() : java.math.BigDecimal.ZERO)
                .amountPaid(dto.getAmountPaid() != null ? dto.getAmountPaid() : java.math.BigDecimal.ZERO)
                .status(dto.getStatus() != null ? ElectronicInvestment.ElectronicInvestmentStatus.valueOf(dto.getStatus().toUpperCase()) : ElectronicInvestment.ElectronicInvestmentStatus.ACTIVE)
                .notes(dto.getNotes())
                .createdBy(dto.getCreatedBy())
                .supplier(supplier)
                .store(store)
                .totalQuantity(dto.getTotalQuantity() != null ? dto.getTotalQuantity() : 0)
                .itemsReceived(dto.getItemsReceived() != null ? dto.getItemsReceived() : 0)
                .productCondition(dto.getProductCondition() != null ? ElectronicInvestment.ProductCondition.valueOf(dto.getProductCondition().toUpperCase()) : ElectronicInvestment.ProductCondition.BOXED)
                .build();
    }
}

