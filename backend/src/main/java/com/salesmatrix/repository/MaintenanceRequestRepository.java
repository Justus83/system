package com.salesmatrix.repository;

import com.salesmatrix.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByStoreId(Long storeId);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByStatus(String status);
    List<MaintenanceRequest> findByStoreIdAndStatus(Long storeId, String status);
}
