package com.salesmatrix.dto;

import com.salesmatrix.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreAccessDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    private String userEmail;

    @NotNull(message = "Store ID is required")
    private Long storeId;

    private String storeName;

    private Long branchId;

    private String branchAddress;

    @NotNull(message = "Role is required")
    private Role role;

    private StoreDTO store;
}
