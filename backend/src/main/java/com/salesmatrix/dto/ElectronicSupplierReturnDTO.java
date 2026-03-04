package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicSupplierReturnDTO {

    private Long id;

    private Long supplierId;
    private String supplierName;

    private Long electronicProductId;
    private String productName;
    private String productSerialNumber;

    private String status;
    private LocalDateTime returnDate;

    private BigDecimal productValue;

    private String returnReason;

    private String replacementSerialNumber;
    private String replacementReason;
    private LocalDateTime replacementDate;

    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
