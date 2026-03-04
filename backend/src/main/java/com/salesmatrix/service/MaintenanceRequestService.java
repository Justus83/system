package com.salesmatrix.service;

import com.salesmatrix.dto.MaintenanceRequestDTO;

import java.util.List;

public interface MaintenanceRequestService {

    MaintenanceRequestDTO createMaintenanceRequest(MaintenanceRequestDTO maintenanceRequestDTO);

    MaintenanceRequestDTO getMaintenanceRequestById(Long id);

    List<MaintenanceRequestDTO> getAllMaintenanceRequests();

    List<MaintenanceRequestDTO> getMaintenanceRequestsByStoreId(Long storeId);

    List<MaintenanceRequestDTO> getMaintenanceRequestsByTenantId(Long tenantId);

    List<MaintenanceRequestDTO> getMaintenanceRequestsByStatus(String status);

    MaintenanceRequestDTO updateMaintenanceRequest(Long id, MaintenanceRequestDTO maintenanceRequestDTO);

    void deleteMaintenanceRequest(Long id);
}
