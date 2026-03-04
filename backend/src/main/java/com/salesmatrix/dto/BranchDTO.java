package com.salesmatrix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BranchDTO {

    private Long id;

    private String address;

    private String phoneNumber;

    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;
}
