package com.salesmatrix.dto;

import com.salesmatrix.enums.ShopType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopDTO {

    private Long id;

    @NotNull(message = "Shop type is required")
    private ShopType shopType;

    private String shopTypeName;

    private Boolean hasBrokers;
}