package com.salesmatrix.service.impl;

import com.salesmatrix.dto.MaintenanceRequestDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.mapper.MaintenanceRequestMapper;
import com.salesmatrix.repository.*;
import com.salesmatrix.service.MaintenanceRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;
    private final StoreRepository storeRepository;
    private final TenantRepository tenantRepository;
    private final SuiteRepository suiteRepository;
    private final RentalHouseRepository rentalHouseRepository;
    private final HostelRoomRepository hostelRoomRepository;
    private final MaintenanceRequestMapper maintenanceRequestMapper;

    @Override
    public MaintenanceRequestDTO createMaintenanceRequest(MaintenanceRequestDTO maintenanceRequestDTO) {
        Store store = storeRepository.findById(maintenanceRequestDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Tenant tenant = maintenanceRequestDTO.getTenantId() != null ?
                tenantRepository.findById(maintenanceRequestDTO.getTenantId()).orElse(null) : null;
        Suite suite = maintenanceRequestDTO.getSuiteId() != null ?
                suiteRepository.findById(maintenanceRequestDTO.getSuiteId()).orElse(null) : null;
        RentalHouse rentalHouse = maintenanceRequestDTO.getRentalHouseId() != null ?
                rentalHouseRepository.findById(maintenanceRequestDTO.getRentalHouseId()).orElse(null) : null;
        HostelRoom hostelRoom = maintenanceRequestDTO.getHostelRoomId() != null ?
                hostelRoomRepository.findById(maintenanceRequestDTO.getHostelRoomId()).orElse(null) : null;

        MaintenanceRequest maintenanceRequest = maintenanceRequestMapper.toEntity(
                maintenanceRequestDTO, store, tenant, suite, rentalHouse, hostelRoom);
        return maintenanceRequestMapper.toDTO(maintenanceRequestRepository.save(maintenanceRequest));
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceRequestDTO getMaintenanceRequestById(Long id) {
        return maintenanceRequestRepository.findById(id)
                .map(maintenanceRequestMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestDTO> getAllMaintenanceRequests() {
        return maintenanceRequestRepository.findAll().stream()
                .map(maintenanceRequestMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestDTO> getMaintenanceRequestsByStoreId(Long storeId) {
        return maintenanceRequestRepository.findByStoreId(storeId).stream()
                .map(maintenanceRequestMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestDTO> getMaintenanceRequestsByTenantId(Long tenantId) {
        return maintenanceRequestRepository.findByTenantId(tenantId).stream()
                .map(maintenanceRequestMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceRequestDTO> getMaintenanceRequestsByStatus(String status) {
        return maintenanceRequestRepository.findByStatus(status).stream()
                .map(maintenanceRequestMapper::toDTO)
                .toList();
    }

    @Override
    public MaintenanceRequestDTO updateMaintenanceRequest(Long id, MaintenanceRequestDTO maintenanceRequestDTO) {
        MaintenanceRequest maintenanceRequest = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
        Store store = storeRepository.findById(maintenanceRequestDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Tenant tenant = maintenanceRequestDTO.getTenantId() != null ?
                tenantRepository.findById(maintenanceRequestDTO.getTenantId()).orElse(null) : null;
        Suite suite = maintenanceRequestDTO.getSuiteId() != null ?
                suiteRepository.findById(maintenanceRequestDTO.getSuiteId()).orElse(null) : null;
        RentalHouse rentalHouse = maintenanceRequestDTO.getRentalHouseId() != null ?
                rentalHouseRepository.findById(maintenanceRequestDTO.getRentalHouseId()).orElse(null) : null;
        HostelRoom hostelRoom = maintenanceRequestDTO.getHostelRoomId() != null ?
                hostelRoomRepository.findById(maintenanceRequestDTO.getHostelRoomId()).orElse(null) : null;

        maintenanceRequestMapper.updateEntity(maintenanceRequest, maintenanceRequestDTO, 
                store, tenant, suite, rentalHouse, hostelRoom);
        return maintenanceRequestMapper.toDTO(maintenanceRequestRepository.save(maintenanceRequest));
    }

    @Override
    public void deleteMaintenanceRequest(Long id) {
        if (!maintenanceRequestRepository.existsById(id)) {
            throw new RuntimeException("Maintenance request not found");
        }
        maintenanceRequestRepository.deleteById(id);
    }
}
