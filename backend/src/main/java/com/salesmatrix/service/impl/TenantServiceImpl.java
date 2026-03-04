package com.salesmatrix.service.impl;

import com.salesmatrix.dto.TenantDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.mapper.TenantMapper;
import com.salesmatrix.repository.*;
import com.salesmatrix.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final StoreRepository storeRepository;
    private final RentalHouseRepository rentalHouseRepository;
    private final SuiteRepository suiteRepository;
    private final HostelRoomRepository hostelRoomRepository;
    private final TenantMapper tenantMapper;

    @Override
    public TenantDTO createTenant(TenantDTO tenantDTO) {
        Store store = storeRepository.findById(tenantDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        RentalHouse rentalHouse = tenantDTO.getRentalHouseId() != null ?
                rentalHouseRepository.findById(tenantDTO.getRentalHouseId()).orElse(null) : null;
        Suite suite = tenantDTO.getSuiteId() != null ?
                suiteRepository.findById(tenantDTO.getSuiteId()).orElse(null) : null;
        HostelRoom hostelRoom = tenantDTO.getHostelRoomId() != null ?
                hostelRoomRepository.findById(tenantDTO.getHostelRoomId()).orElse(null) : null;

        // Update property status to OCCUPIED
        if (hostelRoom != null) {
            hostelRoom.setStatus(RentalStatus.OCCUPIED);
            hostelRoomRepository.save(hostelRoom);
        }
        if (suite != null) {
            suite.setStatus(RentalStatus.OCCUPIED);
            suiteRepository.save(suite);
        }
        if (rentalHouse != null) {
            rentalHouse.setStatus(RentalStatus.OCCUPIED);
            rentalHouseRepository.save(rentalHouse);
        }

        Tenant tenant = tenantMapper.toEntity(tenantDTO, store, rentalHouse, suite, hostelRoom);
        return tenantMapper.toDTO(tenantRepository.save(tenant));
    }

    @Override
    @Transactional(readOnly = true)
    public TenantDTO getTenantById(Long id) {
        return tenantRepository.findByIdWithRelations(id)
                .map(tenantMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getTenantsByStoreId(Long storeId) {
        return tenantRepository.findByStoreIdWithRelations(storeId).stream()
                .map(tenantMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getTenantsByRentalHouseId(Long rentalHouseId) {
        return tenantRepository.findByRentalHouseId(rentalHouseId).stream()
                .map(tenantMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getTenantsBySuiteId(Long suiteId) {
        return tenantRepository.findBySuiteId(suiteId).stream()
                .map(tenantMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantDTO> getTenantsByHostelRoomId(Long hostelRoomId) {
        return tenantRepository.findByHostelRoomId(hostelRoomId).stream()
                .map(tenantMapper::toDTO)
                .toList();
    }

    @Override
    public TenantDTO updateTenant(Long id, TenantDTO tenantDTO) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        Store store = storeRepository.findById(tenantDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        // Get the old properties to update their status if changed
        HostelRoom oldHostelRoom = tenant.getHostelRoom();
        Suite oldSuite = tenant.getSuite();
        RentalHouse oldRentalHouse = tenant.getRentalHouse();

        RentalHouse rentalHouse = tenantDTO.getRentalHouseId() != null ?
                rentalHouseRepository.findById(tenantDTO.getRentalHouseId()).orElse(null) : null;
        Suite suite = tenantDTO.getSuiteId() != null ?
                suiteRepository.findById(tenantDTO.getSuiteId()).orElse(null) : null;
        HostelRoom hostelRoom = tenantDTO.getHostelRoomId() != null ?
                hostelRoomRepository.findById(tenantDTO.getHostelRoomId()).orElse(null) : null;

        // Update hostel room statuses if changed
        if (oldHostelRoom != null && (hostelRoom == null || !oldHostelRoom.getId().equals(hostelRoom.getId()))) {
            oldHostelRoom.setStatus(RentalStatus.VACANT);
            hostelRoomRepository.save(oldHostelRoom);
        }
        if (hostelRoom != null && (oldHostelRoom == null || !hostelRoom.getId().equals(oldHostelRoom.getId()))) {
            hostelRoom.setStatus(RentalStatus.OCCUPIED);
            hostelRoomRepository.save(hostelRoom);
        }

        // Update suite statuses if changed
        if (oldSuite != null && (suite == null || !oldSuite.getId().equals(suite.getId()))) {
            oldSuite.setStatus(RentalStatus.VACANT);
            suiteRepository.save(oldSuite);
        }
        if (suite != null && (oldSuite == null || !suite.getId().equals(oldSuite.getId()))) {
            suite.setStatus(RentalStatus.OCCUPIED);
            suiteRepository.save(suite);
        }

        // Update rental house statuses if changed
        if (oldRentalHouse != null && (rentalHouse == null || !oldRentalHouse.getId().equals(rentalHouse.getId()))) {
            oldRentalHouse.setStatus(RentalStatus.VACANT);
            rentalHouseRepository.save(oldRentalHouse);
        }
        if (rentalHouse != null && (oldRentalHouse == null || !rentalHouse.getId().equals(oldRentalHouse.getId()))) {
            rentalHouse.setStatus(RentalStatus.OCCUPIED);
            rentalHouseRepository.save(rentalHouse);
        }

        tenantMapper.updateEntity(tenant, tenantDTO, store, rentalHouse, suite, hostelRoom);
        return tenantMapper.toDTO(tenantRepository.save(tenant));
    }

    @Override
    public void deleteTenant(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        
        // Set properties back to VACANT when tenant is deleted
        if (tenant.getHostelRoom() != null) {
            HostelRoom hostelRoom = tenant.getHostelRoom();
            hostelRoom.setStatus(RentalStatus.VACANT);
            hostelRoomRepository.save(hostelRoom);
        }
        if (tenant.getSuite() != null) {
            Suite suite = tenant.getSuite();
            suite.setStatus(RentalStatus.VACANT);
            suiteRepository.save(suite);
        }
        if (tenant.getRentalHouse() != null) {
            RentalHouse rentalHouse = tenant.getRentalHouse();
            rentalHouse.setStatus(RentalStatus.VACANT);
            rentalHouseRepository.save(rentalHouse);
        }
        
        tenantRepository.deleteById(id);
    }
}
