package com.salesmatrix.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicShipmentDTO {

    private Long id;
    private Long invoiceId;
    private String invoiceNumber;
    private Long storeId;
    private String storeName;
    private LocalDateTime date;
    private Integer stockExpected;
    private Integer stockBrought;
    private String productDetails;
    private LocalDateTime createdAt;
}
