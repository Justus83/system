package com.salesmatrix.service;

import com.salesmatrix.dto.SubscriptionDTO;
import com.salesmatrix.enums.SubscriptionPlan;

import java.util.List;

public interface SubscriptionService {
    
    SubscriptionDTO createSubscription(SubscriptionDTO dto);
    
    SubscriptionDTO getSubscriptionById(Long id);
    
    SubscriptionDTO getSubscriptionByUserId(Long userId);
    
    List<SubscriptionDTO> getAllSubscriptions();
    
    SubscriptionDTO updateSubscription(Long id, SubscriptionDTO dto);
    
    void deleteSubscription(Long id);
    
    SubscriptionDTO upgradePlan(Long id, SubscriptionPlan newPlan);
    
    SubscriptionDTO deactivateSubscription(Long id);
    
    SubscriptionDTO activateSubscription(Long id);
    
    boolean canCreateStore(Long userId);
    
    boolean canCreateBranch(Long userId, Long storeId);
    
    boolean canAddUser(Long userId);
}
