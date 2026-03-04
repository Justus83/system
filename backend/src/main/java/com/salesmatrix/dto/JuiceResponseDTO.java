package com.salesmatrix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JuiceResponseDTO {
    private Long id;
    
    // ID fields for editing
    private Long brandId;
    private Long sizeId;
    
    // Name fields for display
    private String brand;
    private String brandName;
    private String size;
    private String sizeName;
    
    private Long storeId;
    private String storeName;
    private Long branchId;
    private String branchAddress;
}
