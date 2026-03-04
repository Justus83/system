package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentDTO {

    private Long id;

    @NotBlank(message = "Apartment name is required")
    private String apartmentName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private String location;
}
