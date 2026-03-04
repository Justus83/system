package com.salesmatrix.repository;

import com.salesmatrix.enums.Role;
import com.salesmatrix.entity.StoreAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreAccessRepository extends JpaRepository<StoreAccess, Long> {

    List<StoreAccess> findByUserId(Long userId);
    
    @org.springframework.data.jpa.repository.Query("SELECT sa FROM StoreAccess sa LEFT JOIN FETCH sa.store LEFT JOIN FETCH sa.store.shop WHERE sa.user.id = :userId")
    List<StoreAccess> findByUserIdWithStore(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<StoreAccess> findByStoreId(Long storeId);

    List<StoreAccess> findByBranchId(Long branchId);

    Optional<StoreAccess> findByUserIdAndStoreId(Long userId, Long storeId);

    Optional<StoreAccess> findByUserIdAndStoreIdAndBranchId(Long userId, Long storeId, Long branchId);

    List<StoreAccess> findByUserIdAndRole(Long userId, Role role);

    boolean existsByUserIdAndStoreId(Long userId, Long storeId);
    
    long countByUserIdAndRole(Long userId, Role role);
    
    @org.springframework.data.jpa.repository.Query(value = "SELECT COUNT(DISTINCT sa.user_id) FROM store_access sa WHERE sa.store_id IN (SELECT sa2.store_id FROM store_access sa2 WHERE sa2.user_id = :ownerId AND sa2.role = 'OWNER')", nativeQuery = true)
    long countDistinctUserByStoreOwnerId(@org.springframework.data.repository.query.Param("ownerId") Long ownerId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT COUNT(DISTINCT sa.user_id) FROM store_access sa WHERE sa.store_id IN (SELECT sa2.store_id FROM store_access sa2 WHERE sa2.user_id = :ownerUserId AND sa2.role = 'OWNER')", nativeQuery = true)
    long countDistinctUsersByOwnerUserId(@org.springframework.data.repository.query.Param("ownerUserId") Long ownerUserId);
}
