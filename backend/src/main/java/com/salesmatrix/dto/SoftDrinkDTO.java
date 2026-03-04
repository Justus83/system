package com.salesmatrix.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SoftDrinkDTO {
    private Long type;
    private Long brand;
    private Long size;
    private Long storeId;
    private Long branchId;
}
