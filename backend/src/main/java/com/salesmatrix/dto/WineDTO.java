package com.salesmatrix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineDTO {

    private Long id;

    @NotNull(message = "Brand is required")
    private Long brand;
    
    private String brandName;

    @NotNull(message = "Type is required")
    private Long type;
    
    private String typeName;

    @NotNull(message = "Size is required")
    private Long size;
    
    private String sizeName;

    private Long year;
    
    private String yearName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    private BigDecimal costPrice;

    private String status;

    private String productCondition;
}
