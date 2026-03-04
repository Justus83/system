package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicInvestmentDTO {

    private Long id;
    private String invoiceNumber;
    private String productDetails;
    private LocalDateTime investmentDate;
    private Integer totalItems;
    private Integer itemsRemaining;
    private BigDecimal totalAmount;
    private BigDecimal balance;
    private BigDecimal amountPaid;
    private String status;
    private String notes;
    private Integer createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long supplierId;
    private String supplierName;
    private Long storeId;
    private String storeName;
    private Integer totalQuantity;
    private Integer itemsReceived;
    private String productCondition;
}

