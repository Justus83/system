package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SmartwatchDTO {

    private Long id;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotNull(message = "Source type is required")
    private String sourceType;

    private Long supplierId;

    private String supplierName;

    private String otherSourceName;

    @Pattern(regexp = "^[+]?[0-9\\s\\-()]+$", message = "Phone number must be valid")
    private String otherSourcePhoneNumber;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    private BigDecimal costPrice;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotBlank(message = "Model is required")
    private String model;

    private String color;

    @Positive(message = "Case size MM must be positive")
    private Integer caseSizeMM;

    private String status;
    
    private String productCondition;
}
