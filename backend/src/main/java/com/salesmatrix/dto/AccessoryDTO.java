package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessoryDTO {

    private Long id;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

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

}
