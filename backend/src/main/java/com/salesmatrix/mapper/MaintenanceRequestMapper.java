package com.salesmatrix.mapper;

import com.salesmatrix.dto.MaintenanceRequestDTO;
import com.salesmatrix.entity.*;
import org.springframework.stereotype.Component;

@Component
public class MaintenanceRequestMapper {

    public MaintenanceRequest toEntity(MaintenanceRequestDTO dto, Store store, Tenant tenant, Suite suite, RentalHouse rentalHouse, HostelRoom hostelRoom) {
        return MaintenanceRequest.builder()
                .tenant(tenant)
                .suite(suite)
                .rentalHouse(rentalHouse)
                .hostelRoom(hostelRoom)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(dto.getPriority())
                .status(dto.getStatus())
                .requestDate(dto.getRequestDate())
                .completionDate(dto.getCompletionDate())
                .cost(dto.getCost())
                .resolution(dto.getResolution())
                .store(store)
                .build();
    }

    public MaintenanceRequestDTO toDTO(MaintenanceRequest maintenanceRequest) {
        return MaintenanceRequestDTO.builder()
                .id(maintenanceRequest.getId())
                .tenantId(maintenanceRequest.getTenant() != null ? maintenanceRequest.getTenant().getId() : null)
                .tenantName(maintenanceRequest.getTenant() != null ? maintenanceRequest.getTenant().getName() : null)
                .suiteId(maintenanceRequest.getSuite() != null ? maintenanceRequest.getSuite().getId() : null)
                .suiteName(maintenanceRequest.getSuite() != null ? maintenanceRequest.getSuite().getSuiteName() : null)
                .rentalHouseId(maintenanceRequest.getRentalHouse() != null ? maintenanceRequest.getRentalHouse().getId() : null)
                .rentalHouseName(maintenanceRequest.getRentalHouse() != null ? maintenanceRequest.getRentalHouse().getHouseName() : null)
                .hostelRoomId(maintenanceRequest.getHostelRoom() != null ? maintenanceRequest.getHostelRoom().getId() : null)
                .hostelRoomName(maintenanceRequest.getHostelRoom() != null ? maintenanceRequest.getHostelRoom().getRoomName() : null)
                .title(maintenanceRequest.getTitle())
                .description(maintenanceRequest.getDescription())
                .priority(maintenanceRequest.getPriority())
                .status(maintenanceRequest.getStatus())
                .requestDate(maintenanceRequest.getRequestDate())
                .completionDate(maintenanceRequest.getCompletionDate())
                .cost(maintenanceRequest.getCost())
                .resolution(maintenanceRequest.getResolution())
                .storeId(maintenanceRequest.getStore() != null ? maintenanceRequest.getStore().getId() : null)
                .storeName(maintenanceRequest.getStore() != null ? maintenanceRequest.getStore().getName() : null)
                .build();
    }

    public void updateEntity(MaintenanceRequest maintenanceRequest, MaintenanceRequestDTO dto, Store store, Tenant tenant, Suite suite, RentalHouse rentalHouse, HostelRoom hostelRoom) {
        maintenanceRequest.setTenant(tenant);
        maintenanceRequest.setSuite(suite);
        maintenanceRequest.setRentalHouse(rentalHouse);
        maintenanceRequest.setHostelRoom(hostelRoom);
        maintenanceRequest.setTitle(dto.getTitle());
        maintenanceRequest.setDescription(dto.getDescription());
        maintenanceRequest.setPriority(dto.getPriority());
        maintenanceRequest.setStatus(dto.getStatus());
        maintenanceRequest.setRequestDate(dto.getRequestDate());
        maintenanceRequest.setCompletionDate(dto.getCompletionDate());
        maintenanceRequest.setCost(dto.getCost());
        maintenanceRequest.setResolution(dto.getResolution());
        maintenanceRequest.setStore(store);
    }
}
