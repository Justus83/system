package com.salesmatrix.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JuiceDTO {
    private Long brand;
    private Long size;
    private Long storeId;
    private Long branchId;
}
