package com.salesmatrix.repository;

import com.salesmatrix.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    List<Supplier> findByStoreId(Long storeId);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(s) FROM Supplier s WHERE s.store.id IN (SELECT sa.store.id FROM StoreAccess sa WHERE sa.user.id = :userId AND sa.role = 'OWNER')")
    long countByOwnerUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}