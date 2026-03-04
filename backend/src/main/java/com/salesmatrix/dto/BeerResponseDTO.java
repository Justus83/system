package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BeerResponseDTO {
    private Long id;
    private Long brandId;
    private String brand;
    private String brandName;
    private Long storeId;
    private String storeName;
    private Long branchId;
    private String branchAddress;
    private BigDecimal costPrice;
    private Long sizeId;
    private String size;
    private String sizeName;
    private Long packagingId;
    private String packaging;
    private String packagingName;
    private String status;
    private String productCondition;
}
