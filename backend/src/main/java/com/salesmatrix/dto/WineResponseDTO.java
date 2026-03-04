package com.salesmatrix.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineResponseDTO {
    private Long id;
    private Long brandId;
    private String brand;
    private String brandName;
    private Long typeId;
    private String type;
    private String typeName;
    private Long sizeId;
    private String size;
    private String sizeName;
    private Long yearId;
    private String year;
    private String yearName;
    private String name;
    private Long storeId;
    private String storeName;
    private Long branchId;
    private String branchAddress;
    private BigDecimal costPrice;
    private String status;
    private String productCondition;
}
