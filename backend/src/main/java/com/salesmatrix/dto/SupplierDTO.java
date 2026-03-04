package com.salesmatrix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String contactPerson;

    private String phoneNumber;

    @Email(message = "Email must be valid")
    private String email;

    private String address;

    private Long storeId;

    private String storeName;
}