package com.salesmatrix.service;

import com.salesmatrix.dto.TenantDTO;

import java.util.List;

public interface TenantService {

    TenantDTO createTenant(TenantDTO tenantDTO);

    TenantDTO getTenantById(Long id);

    List<TenantDTO> getAllTenants();

    List<TenantDTO> getTenantsByStoreId(Long storeId);

    List<TenantDTO> getTenantsByRentalHouseId(Long rentalHouseId);

    List<TenantDTO> getTenantsBySuiteId(Long suiteId);

    List<TenantDTO> getTenantsByHostelRoomId(Long hostelRoomId);

    TenantDTO updateTenant(Long id, TenantDTO tenantDTO);

    void deleteTenant(Long id);
}
