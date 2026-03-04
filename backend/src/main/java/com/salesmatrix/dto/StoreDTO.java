package com.salesmatrix.dto;

import com.salesmatrix.enums.ShopType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDTO {

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    private String address;

    private String phoneNumber;

    @Email(message = "Email must be valid")
    private String email;

    private Long shopId;

    private ShopType shopType;
    
    private String shopTypeName;

    private Boolean hasBrokers;

    private ShopDTO shop;
}
