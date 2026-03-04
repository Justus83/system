package com.salesmatrix.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UserDTO user;
    @Builder.Default
    private boolean hasStoreAccess = false;
    private Long storeId;
    private Long branchId;
    private String shopType;
}