package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseDTO {

    private Long id;
    private LocalDate expenseDate;
    private String expenditure;
    private BigDecimal amount;
    private Long storeId;
    private String storeName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
