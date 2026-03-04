package com.salesmatrix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HostelDTO {

    private Long id;

    @NotBlank(message = "Hostel name is required")
    private String hostelName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private String location;

    private String address;
}
