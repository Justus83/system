package com.salesmatrix.dto;

import com.salesmatrix.entity.BarInventory;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarShiftStockDTO {

    private Long id;
    private BarInventory.ProductType productType;
    private Long productId;
    private String productName;
    private Integer openingQuantity;
    private Integer closingQuantity;
    private Integer expectedClosingQuantity;
    private Integer quantityVariance;
    private Boolean isOpening;
}
