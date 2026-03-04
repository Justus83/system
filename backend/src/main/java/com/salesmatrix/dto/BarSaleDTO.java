package com.salesmatrix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarSaleDTO {

    private Long id;

    @NotNull(message = "Counter ID is required")
    private Long counterId;

    private String counterName;

    private LocalDateTime saleDate;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    private String paymentMethod;

    private String customerName;

    private String notes;

    private String servedBy;

    @NotNull(message = "Sale items are required")
    private List<BarSaleItemDTO> items;
}
