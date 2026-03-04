package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicReturnDTO {

    private Long id;

    private Long electronicSaleId;
    private String saleProductName;
    private String saleProductSerialNumber;

    private Long returnedProductId;
    private String returnedProductName;
    private String returnedProductSerialNumber;

    private Long replacementProductId;
    private String replacementProductName;
    private String replacementProductSerialNumber;

    private String returnReason;
    private String returnStatus;
    private LocalDateTime returnDate;

    private Boolean isReplacement;
    private LocalDateTime replacementDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
