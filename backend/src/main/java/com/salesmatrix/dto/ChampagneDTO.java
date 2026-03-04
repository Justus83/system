package com.salesmatrix.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChampagneDTO {

    private Long id;

    @NotNull(message = "Brand is required")
    private Long brand;
    
    private String brandName;

    private Long size;
    
    private String sizeName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    private BigDecimal costPrice;

    private String status;

    private String productCondition;
}
