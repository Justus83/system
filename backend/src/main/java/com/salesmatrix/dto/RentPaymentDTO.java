package com.salesmatrix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RentPaymentDTO {

    private Long id;

    @NotNull(message = "Tenant ID is required")
    private Long tenantId;

    private String tenantName;

    @NotNull(message = "Amount paid is required")
    private BigDecimal amountPaid;

    @NotNull(message = "Rent payable is required")
    private BigDecimal rentPayable;

    private BigDecimal balance;

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    private LocalDate nextPaymentDate;

    @NotNull(message = "Payment status is required")
    private String paymentStatus;

    private String paymentMethod;

    private String remarks;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;
}
