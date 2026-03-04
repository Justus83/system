package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuiteDTO {

    private Long id;

    @NotBlank(message = "Suite name is required")
    private String suiteName;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Apartment ID is required")
    private Long apartmentId;

    private String apartmentName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private String status;
}
