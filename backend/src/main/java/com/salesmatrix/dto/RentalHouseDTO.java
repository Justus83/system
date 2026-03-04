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
public class RentalHouseDTO {

    private Long id;

    @NotBlank(message = "House name is required")
    private String houseName;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private String location;

    private String status;
}
