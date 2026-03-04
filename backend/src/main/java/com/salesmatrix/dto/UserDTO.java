package com.salesmatrix.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    private String phoneNumber;

    // Employee-specific fields
    private LocalDateTime hireDate;
    private BigDecimal salary;
    private String position;
    private String address;
    private Boolean isActive;
}
