package com.salesmatrix.mapper;

import com.salesmatrix.dto.SubscriptionDTO;
import com.salesmatrix.entity.Subscription;
import com.salesmatrix.entity.User;
import org.springframework.stereotype.Component;

@Component
public class SubscriptionMapper {
    
    public Subscription toEntity(SubscriptionDTO dto, User user) {
        return Subscription.builder()
                .owner(user)
                .plan(dto.getPlan())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .active(dto.isActive())
                .build();
    }
    
    public SubscriptionDTO toDTO(Subscription subscription) {
        User user = subscription.getOwner();
        return SubscriptionDTO.builder()
                .id(subscription.getId())
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getName() : null)
                .userEmail(user != null ? user.getEmail() : null)
                .plan(subscription.getPlan())
                .planDisplayName(subscription.getPlan().getDisplayName())
                .price(subscription.getPlan().getPrice())
                .maxStores(subscription.getPlan().getMaxStores())
                .maxUsers(subscription.getPlan().getMaxUsers())
                .maxBranches(subscription.getPlan().getMaxBranches())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .active(subscription.isActive())
                .createdAt(subscription.getCreatedAt())
                .updatedAt(subscription.getUpdatedAt())
                .build();
    }
    
    public void updateEntityFromDTO(SubscriptionDTO dto, Subscription subscription, User user) {
        subscription.setOwner(user);
        subscription.setPlan(dto.getPlan());
        subscription.setStartDate(dto.getStartDate());
        subscription.setEndDate(dto.getEndDate());
        subscription.setActive(dto.isActive());
    }
}
