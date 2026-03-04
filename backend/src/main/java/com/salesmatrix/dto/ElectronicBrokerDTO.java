package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicBrokerDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String phoneNumber;

    @NotBlank(message = "Shop name is required")
    private String shopName;

    private String address;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;
}
