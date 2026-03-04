package com.salesmatrix.dto;

import com.salesmatrix.entity.BarShift;
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
public class BarShiftDTO {

    private Long id;

    @NotNull(message = "Counter ID is required")
    private Long counterId;

    private String counterName;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String username;

    private LocalDateTime shiftStart;

    private LocalDateTime shiftEnd;

    @NotNull(message = "Opening cash is required")
    private BigDecimal openingCash;

    private BigDecimal closingCash;

    private BigDecimal expectedClosingCash;

    private BigDecimal cashVariance;

    private BigDecimal totalSales;

    private BigDecimal totalExpenses;

    private BarShift.ShiftStatus status;

    private String notes;

    private Boolean verifiedByNextShift;

    private String discrepancyNotes;

    private List<BarShiftStockDTO> stockItems;
}
