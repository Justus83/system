package com.salesmatrix.mapper;

import com.salesmatrix.dto.SuiteDTO;
import com.salesmatrix.entity.Apartment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Suite;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.stereotype.Component;

@Component
public class SuiteMapper {

    public Suite toEntity(SuiteDTO dto, Apartment apartment, Store store) {
        return Suite.builder()
                .suiteName(dto.getSuiteName())
                .price(dto.getPrice())
                .apartment(apartment)
                .store(store)
                .status(dto.getStatus() != null ? RentalStatus.valueOf(dto.getStatus()) : RentalStatus.VACANT)
                .build();
    }

    public SuiteDTO toDTO(Suite suite) {
        return SuiteDTO.builder()
                .id(suite.getId())
                .suiteName(suite.getSuiteName())
                .price(suite.getPrice())
                .apartmentId(suite.getApartment() != null ? suite.getApartment().getId() : null)
                .apartmentName(suite.getApartment() != null ? suite.getApartment().getApartmentName() : null)
                .storeId(suite.getStore() != null ? suite.getStore().getId() : null)
                .storeName(suite.getStore() != null ? suite.getStore().getName() : null)
                .status(suite.getStatus() != null ? suite.getStatus().name() : null)
                .build();
    }

    public void updateEntity(Suite suite, SuiteDTO dto, Apartment apartment, Store store) {
        suite.setSuiteName(dto.getSuiteName());
        suite.setPrice(dto.getPrice());
        suite.setApartment(apartment);
        suite.setStore(store);
        if (dto.getStatus() != null) {
            suite.setStatus(RentalStatus.valueOf(dto.getStatus()));
        }
    }
}
