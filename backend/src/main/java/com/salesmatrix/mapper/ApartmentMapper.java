package com.salesmatrix.mapper;

import com.salesmatrix.dto.ApartmentDTO;
import com.salesmatrix.entity.Apartment;
import com.salesmatrix.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class ApartmentMapper {

    public Apartment toEntity(ApartmentDTO dto, Store store) {
        return Apartment.builder()
                .apartmentName(dto.getApartmentName())
                .store(store)
                .location(dto.getLocation())
                .build();
    }

    public ApartmentDTO toDTO(Apartment apartment) {
        return ApartmentDTO.builder()
                .id(apartment.getId())
                .apartmentName(apartment.getApartmentName())
                .storeId(apartment.getStore() != null ? apartment.getStore().getId() : null)
                .storeName(apartment.getStore() != null ? apartment.getStore().getName() : null)
                .location(apartment.getLocation())
                .build();
    }

    public void updateEntity(Apartment apartment, ApartmentDTO dto, Store store) {
        apartment.setApartmentName(dto.getApartmentName());
        apartment.setStore(store);
        apartment.setLocation(dto.getLocation());
    }
}
