package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Contact is required")
    private String contact;

    private String address;

    private String email;

    @NotNull(message = "Date of registration is required")
    private LocalDate dateOfRegistration;

    private Long rentalHouseId;

    private String rentalHouseName;

    private Long suiteId;

    private String suiteName;

    private Long hostelRoomId;

    private String hostelRoomName;

    private String hostelName;

    private String apartmentName;

    private Double rentalHousePrice;

    private Double suitePrice;

    private Double hostelRoomPrice;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;
}
