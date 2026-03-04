package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String phoneNumber;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;
}
