package com.salesmatrix.repository;

import com.salesmatrix.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByStoreId(Long storeId);

    List<Customer> findByBranchId(Long branchId);
    
    Optional<Customer> findByPhoneNumberAndStoreId(String phoneNumber, Long storeId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(c) FROM Customer c WHERE c.store.id IN (SELECT sa.store.id FROM StoreAccess sa WHERE sa.user.id = :userId AND sa.role = 'OWNER')")
    long countByOwnerUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}