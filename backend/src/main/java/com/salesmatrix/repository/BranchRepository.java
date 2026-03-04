package com.salesmatrix.repository;

import com.salesmatrix.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    List<Branch> findByStoreId(Long storeId);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(b) FROM Branch b WHERE b.store.id IN (SELECT sa.store.id FROM StoreAccess sa WHERE sa.user.id = :userId AND sa.role = 'OWNER')")
    long countByOwnerUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
