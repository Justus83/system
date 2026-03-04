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
public class HostelRoomDTO {

    private Long id;

    @NotBlank(message = "Room name is required")
    private String roomName;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Hostel ID is required")
    private Long hostelId;

    private String hostelName;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private String status;
}
