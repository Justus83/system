package com.salesmatrix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoftDrinkResponseDTO {
    private Long id;
    
    // Type fields
    private Long typeId;
    private String type;
    private String typeName;
    
    // Brand fields
    private Long brandId;
    private String brand;
    private String brandName;
    
    // Size fields
    private Long sizeId;
    private String size;
    private String sizeName;
    
    private Long storeId;
    private String storeName;
    private Long branchId;
    private String branchAddress;
}
