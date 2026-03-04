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
public class BeerDTO {

    private Long id;

    @NotNull(message = "Brand is required")
    private Long brand;
    
    private String brandName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    private BigDecimal costPrice;

    @NotNull(message = "Size is required")
    private Long size;
    
    private String sizeName;

    @NotNull(message = "Packaging is required")
    private Long packaging;
    
    private String packagingName;

    private String status;

    private String productCondition;
}
