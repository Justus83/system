package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequestDTO {

    private Long id;

    private Long tenantId;

    private String tenantName;

    private Long suiteId;

    private String suiteName;

    private Long rentalHouseId;

    private String rentalHouseName;

    private Long hostelRoomId;

    private String hostelRoomName;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Priority is required")
    private String priority;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Request date is required")
    private LocalDate requestDate;

    private LocalDate completionDate;

    private BigDecimal cost;

    private String resolution;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;
}
