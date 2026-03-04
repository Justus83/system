package com.salesmatrix.mapper;

import com.salesmatrix.dto.HostelDTO;
import com.salesmatrix.entity.Hostel;
import com.salesmatrix.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class HostelMapper {

    public Hostel toEntity(HostelDTO dto, Store store) {
        return Hostel.builder()
                .hostelName(dto.getHostelName())
                .store(store)
                .location(dto.getLocation())
                .address(dto.getAddress())
                .build();
    }

    public HostelDTO toDTO(Hostel hostel) {
        return HostelDTO.builder()
                .id(hostel.getId())
                .hostelName(hostel.getHostelName())
                .storeId(hostel.getStore() != null ? hostel.getStore().getId() : null)
                .storeName(hostel.getStore() != null ? hostel.getStore().getName() : null)
                .location(hostel.getLocation())
                .address(hostel.getAddress())
                .build();
    }

    public void updateEntity(Hostel hostel, HostelDTO dto, Store store) {
        hostel.setHostelName(dto.getHostelName());
        hostel.setStore(store);
        hostel.setLocation(dto.getLocation());
        hostel.setAddress(dto.getAddress());
    }
}
