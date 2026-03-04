package com.salesmatrix.dto;

import com.salesmatrix.entity.BarInventory;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarSaleItemDTO {

    private Long id;

    @NotNull(message = "Product type is required")
    private BarInventory.ProductType productType;

    @NotNull(message = "Product ID is required")
    private Long productId;

    private String productName;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;

    private BigDecimal totalPrice;
}
