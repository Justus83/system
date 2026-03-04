package com.salesmatrix.repository;

import com.salesmatrix.entity.RentPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentPaymentRepository extends JpaRepository<RentPayment, Long> {
    List<RentPayment> findByStoreId(Long storeId);
    List<RentPayment> findByTenantId(Long tenantId);
    List<RentPayment> findByTenantIdOrderByPaymentDateDesc(Long tenantId);
}
