package com.salesmatrix.service;

import com.salesmatrix.dto.HostelRoomDTO;
import com.salesmatrix.enums.RentalStatus;

import java.util.List;

public interface HostelRoomService {

    HostelRoomDTO createHostelRoom(HostelRoomDTO hostelRoomDTO);

    HostelRoomDTO getHostelRoomById(Long id);

    List<HostelRoomDTO> getAllHostelRooms();

    List<HostelRoomDTO> getHostelRoomsByStoreId(Long storeId);

    List<HostelRoomDTO> getHostelRoomsByHostelId(Long hostelId);

    List<HostelRoomDTO> getHostelRoomsByStatus(RentalStatus status);

    HostelRoomDTO updateHostelRoom(Long id, HostelRoomDTO hostelRoomDTO);

    void deleteHostelRoom(Long id);
}
