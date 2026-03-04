package com.salesmatrix.mapper;

import com.salesmatrix.dto.RentalHouseDTO;
import com.salesmatrix.entity.RentalHouse;
import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.stereotype.Component;

@Component
public class RentalHouseMapper {

    public RentalHouse toEntity(RentalHouseDTO dto, Store store) {
        return RentalHouse.builder()
                .houseName(dto.getHouseName())
                .price(dto.getPrice())
                .store(store)
                .location(dto.getLocation())
                .status(dto.getStatus() != null ? RentalStatus.valueOf(dto.getStatus()) : RentalStatus.VACANT)
                .build();
    }

    public RentalHouseDTO toDTO(RentalHouse rentalHouse) {
        return RentalHouseDTO.builder()
                .id(rentalHouse.getId())
                .houseName(rentalHouse.getHouseName())
                .price(rentalHouse.getPrice())
                .storeId(rentalHouse.getStore() != null ? rentalHouse.getStore().getId() : null)
                .storeName(rentalHouse.getStore() != null ? rentalHouse.getStore().getName() : null)
                .location(rentalHouse.getLocation())
                .status(rentalHouse.getStatus() != null ? rentalHouse.getStatus().name() : null)
                .build();
    }

    public void updateEntity(RentalHouse rentalHouse, RentalHouseDTO dto, Store store) {
        rentalHouse.setHouseName(dto.getHouseName());
        rentalHouse.setPrice(dto.getPrice());
        rentalHouse.setStore(store);
        rentalHouse.setLocation(dto.getLocation());
        if (dto.getStatus() != null) {
            rentalHouse.setStatus(RentalStatus.valueOf(dto.getStatus()));
        }
    }
}
