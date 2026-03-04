package com.salesmatrix.dto;

import com.salesmatrix.enums.SubscriptionPlan;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDTO {

    private Long id;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;

    private String userEmail;

    @NotNull(message = "Subscription plan is required")
    private SubscriptionPlan plan;

    private String planDisplayName;

    private Double price;

    private Integer maxStores;

    private Integer maxUsers;

    private Integer maxBranches;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
