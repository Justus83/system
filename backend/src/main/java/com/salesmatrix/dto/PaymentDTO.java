package com.salesmatrix.dto;

import com.salesmatrix.enums.PaymentMethod;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentDTO {
    
    private Long id;
    private Long electronicSaleId;
    private Long brokerTransactionId;
    private BigDecimal paymentAmount;
    private LocalDateTime paymentDate;
    private PaymentMethod paymentMethod;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
}
