package com.salesmatrix.mapper;

import com.salesmatrix.dto.HostelRoomDTO;
import com.salesmatrix.entity.Hostel;
import com.salesmatrix.entity.HostelRoom;
import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.stereotype.Component;

@Component
public class HostelRoomMapper {

    public HostelRoom toEntity(HostelRoomDTO dto, Hostel hostel, Store store) {
        return HostelRoom.builder()
                .roomName(dto.getRoomName())
                .price(dto.getPrice())
                .hostel(hostel)
                .store(store)
                .status(dto.getStatus() != null ? RentalStatus.valueOf(dto.getStatus()) : RentalStatus.VACANT)
                .build();
    }

    public HostelRoomDTO toDTO(HostelRoom hostelRoom) {
        return HostelRoomDTO.builder()
                .id(hostelRoom.getId())
                .roomName(hostelRoom.getRoomName())
                .price(hostelRoom.getPrice())
                .hostelId(hostelRoom.getHostel() != null ? hostelRoom.getHostel().getId() : null)
                .hostelName(hostelRoom.getHostel() != null ? hostelRoom.getHostel().getHostelName() : null)
                .storeId(hostelRoom.getStore() != null ? hostelRoom.getStore().getId() : null)
                .storeName(hostelRoom.getStore() != null ? hostelRoom.getStore().getName() : null)
                .status(hostelRoom.getStatus() != null ? hostelRoom.getStatus().name() : null)
                .build();
    }

    public void updateEntity(HostelRoom hostelRoom, HostelRoomDTO dto, Hostel hostel, Store store) {
        hostelRoom.setRoomName(dto.getRoomName());
        hostelRoom.setPrice(dto.getPrice());
        hostelRoom.setHostel(hostel);
        hostelRoom.setStore(store);
        if (dto.getStatus() != null) {
            hostelRoom.setStatus(RentalStatus.valueOf(dto.getStatus()));
        }
    }
}
