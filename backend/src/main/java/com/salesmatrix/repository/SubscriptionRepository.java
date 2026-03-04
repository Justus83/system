package com.salesmatrix.repository;

import com.salesmatrix.entity.Subscription;
import com.salesmatrix.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    Optional<Subscription> findByOwner(User owner);
    
    Optional<Subscription> findByOwnerId(Long ownerId);
    
    boolean existsByOwner(User owner);
}
