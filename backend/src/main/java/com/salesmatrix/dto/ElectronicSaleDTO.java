package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicSaleDTO {

    private Long id;
    
    private Long electronicProductId;
    private String productName;
    private String productSerialNumber;
    
    private Long storeId;
    private String storeName;
    
    private Long branchId;
    private String branchName;
    
    private Long customerId;
    private String customerName;
    private String customerPhone;
    
    private Long brokerId;
    private String brokerName;
    
    private Long electronicBrokerTransactionId;
    
    // Historical price snapshots - stored at time of sale
    private BigDecimal costPriceAtSale;
    private BigDecimal salePrice;
    private Integer quantity;
    private BigDecimal totalAmount;
    
    // Profit/Loss tracking
    private BigDecimal profit;
    private BigDecimal loss;
    
    // Credit tracking
    private Boolean isCreditSale;
    private BigDecimal creditAmount;
    private BigDecimal amountPaid;
    private BigDecimal balanceDue;
    
    private String paymentMethod;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDateTime saleDate;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private Long createdById;
    private String createdByName;
}
