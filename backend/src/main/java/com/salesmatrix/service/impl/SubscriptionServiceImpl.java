package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SubscriptionDTO;
import com.salesmatrix.entity.Subscription;
import com.salesmatrix.enums.Role;
import com.salesmatrix.enums.SubscriptionPlan;
import com.salesmatrix.entity.User;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.SubscriptionMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.SubscriptionRepository;
import com.salesmatrix.repository.UserRepository;
import com.salesmatrix.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final StoreAccessRepository storeAccessRepository;
    private final BranchRepository branchRepository;
    private final SubscriptionMapper subscriptionMapper;

    @Override
    public SubscriptionDTO createSubscription(SubscriptionDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        
        if (subscriptionRepository.existsByOwner(user)) {
            throw new BusinessException("User already has a subscription");
        }
        
        Subscription subscription = subscriptionMapper.toEntity(dto, user);
        if (subscription.getStartDate() == null) {
            subscription.setStartDate(LocalDateTime.now());
        }
        subscription.setActive(true);
        
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(savedSubscription);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionDTO getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionDTO getSubscriptionByUserId(Long userId) {
        Subscription subscription = subscriptionRepository.findByOwnerId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found for user id: " + userId));
        return subscriptionMapper.toDTO(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(subscriptionMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SubscriptionDTO updateSubscription(Long id, SubscriptionDTO dto) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + dto.getUserId()));
        
        subscriptionMapper.updateEntityFromDTO(dto, subscription, user);
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(updatedSubscription);
    }

    @Override
    public void deleteSubscription(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription not found with id: " + id);
        }
        subscriptionRepository.deleteById(id);
    }

    @Override
    public SubscriptionDTO upgradePlan(Long id, SubscriptionPlan newPlan) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        
        subscription.setPlan(newPlan);
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(updatedSubscription);
    }

    @Override
    public SubscriptionDTO deactivateSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        
        subscription.setActive(false);
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(updatedSubscription);
    }

    @Override
    public SubscriptionDTO activateSubscription(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        
        subscription.setActive(true);
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        return subscriptionMapper.toDTO(updatedSubscription);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canCreateStore(Long userId) {
        Subscription subscription = subscriptionRepository.findByOwnerId(userId)
                .orElse(null);
        
        if (subscription == null || !subscription.isActive()) {
            return false;
        }
        
        SubscriptionPlan plan = subscription.getPlan();
        int maxStores = plan.getMaxStores();
        
        // -1 means unlimited
        if (maxStores == -1) {
            return true;
        }
        
        long currentStoreCount = storeAccessRepository.countByUserIdAndRole(userId, 
                Role.OWNER);
        
        return currentStoreCount < maxStores;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canCreateBranch(Long userId, Long storeId) {
        Subscription subscription = subscriptionRepository.findByOwnerId(userId)
                .orElse(null);
        
        if (subscription == null || !subscription.isActive()) {
            return false;
        }
        
        SubscriptionPlan plan = subscription.getPlan();
        int maxBranches = plan.getMaxBranches();
        
        // -1 means unlimited, 0 means not allowed
        if (maxBranches == -1) {
            return true;
        }
        if (maxBranches == 0) {
            return false;
        }
        
        long currentBranchCount = branchRepository.countByOwnerUserId(userId);
        
        return currentBranchCount < maxBranches;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canAddUser(Long userId) {
        Subscription subscription = subscriptionRepository.findByOwnerId(userId)
                .orElse(null);
        
        if (subscription == null || !subscription.isActive()) {
            return false;
        }
        
        SubscriptionPlan plan = subscription.getPlan();
        int maxUsers = plan.getMaxUsers();
        
        // -1 means unlimited, 0 means not allowed (or only owner)
        if (maxUsers == -1) {
            return true;
        }
        if (maxUsers == 0) {
            return false;
        }
        
        // Count users with access to owner's stores
        long currentUserCount = storeAccessRepository.countDistinctUsersByOwnerUserId(userId);
        
        return currentUserCount < maxUsers;
    }
}
