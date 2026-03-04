package com.salesmatrix.dto;

import com.salesmatrix.entity.BarInventory.ProductType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarInventoryDTO {

    private Long id;

    @NotNull(message = "Counter ID is required")
    private Long counterId;

    private String counterName;

    @NotNull(message = "Product type is required")
    private ProductType productType;

    @NotNull(message = "Product ID is required")
    private Long productId;

    private String productName;
    
    private String brandName;
    
    private String sizeName;
    
    private String packagingName;
    
    private String yearName;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private LocalDateTime lastUpdated;
}

