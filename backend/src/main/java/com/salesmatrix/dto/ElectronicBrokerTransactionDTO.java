package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectronicBrokerTransactionDTO {

    private Long id;

    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    private Long electronicProductId;

    private String productSerialNumber;

    private String productModel;

    private String productType;
    
    private String productColor;
    
    private String productStorageSize;
    
    private String productRamSize;

    private Long brokerId;

    private String brokerName;

    private String brokerShopName;

    private String status;

    private LocalDateTime takenAt;

    private LocalDateTime returnedAt;

    private LocalDateTime soldAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    // Sale information (used when status is SOLD)
    private BigDecimal sellingPrice;
    
    private BigDecimal amountPaid;
    
    private String paymentMethod;
}
