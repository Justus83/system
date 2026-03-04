package com.salesmatrix.mapper;

import com.salesmatrix.dto.TenantDTO;
import com.salesmatrix.entity.*;
import org.springframework.stereotype.Component;

@Component
public class TenantMapper {

    public Tenant toEntity(TenantDTO dto, Store store, RentalHouse rentalHouse, Suite suite, HostelRoom hostelRoom) {
        return Tenant.builder()
                .name(dto.getName())
                .contact(dto.getContact())
                .address(dto.getAddress())
                .email(dto.getEmail())
                .dateOfRegistration(dto.getDateOfRegistration())
                .rentalHouse(rentalHouse)
                .suite(suite)
                .hostelRoom(hostelRoom)
                .store(store)
                .build();
    }

    public TenantDTO toDTO(Tenant tenant) {
        return TenantDTO.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .contact(tenant.getContact())
                .address(tenant.getAddress())
                .email(tenant.getEmail())
                .dateOfRegistration(tenant.getDateOfRegistration())
                .rentalHouseId(tenant.getRentalHouse() != null ? tenant.getRentalHouse().getId() : null)
                .rentalHouseName(tenant.getRentalHouse() != null ? tenant.getRentalHouse().getHouseName() : null)
                .rentalHousePrice(tenant.getRentalHouse() != null ? tenant.getRentalHouse().getPrice().doubleValue() : null)
                .suiteId(tenant.getSuite() != null ? tenant.getSuite().getId() : null)
                .suiteName(tenant.getSuite() != null ? tenant.getSuite().getSuiteName() : null)
                .suitePrice(tenant.getSuite() != null ? tenant.getSuite().getPrice().doubleValue() : null)
                .apartmentName(tenant.getSuite() != null && tenant.getSuite().getApartment() != null ? tenant.getSuite().getApartment().getApartmentName() : null)
                .hostelRoomId(tenant.getHostelRoom() != null ? tenant.getHostelRoom().getId() : null)
                .hostelRoomName(tenant.getHostelRoom() != null ? tenant.getHostelRoom().getRoomName() : null)
                .hostelRoomPrice(tenant.getHostelRoom() != null ? tenant.getHostelRoom().getPrice().doubleValue() : null)
                .hostelName(tenant.getHostelRoom() != null && tenant.getHostelRoom().getHostel() != null ? tenant.getHostelRoom().getHostel().getHostelName() : null)
                .storeId(tenant.getStore() != null ? tenant.getStore().getId() : null)
                .storeName(tenant.getStore() != null ? tenant.getStore().getName() : null)
                .build();
    }

    public void updateEntity(Tenant tenant, TenantDTO dto, Store store, RentalHouse rentalHouse, Suite suite, HostelRoom hostelRoom) {
        tenant.setName(dto.getName());
        tenant.setContact(dto.getContact());
        tenant.setAddress(dto.getAddress());
        tenant.setEmail(dto.getEmail());
        tenant.setDateOfRegistration(dto.getDateOfRegistration());
        tenant.setRentalHouse(rentalHouse);
        tenant.setSuite(suite);
        tenant.setHostelRoom(hostelRoom);
        tenant.setStore(store);
    }
}
