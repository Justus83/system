package com.salesmatrix.service.impl;

import com.salesmatrix.dto.HostelRoomDTO;
import com.salesmatrix.entity.Hostel;
import com.salesmatrix.entity.HostelRoom;
import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.RentalStatus;
import com.salesmatrix.mapper.HostelRoomMapper;
import com.salesmatrix.repository.HostelRepository;
import com.salesmatrix.repository.HostelRoomRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.HostelRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HostelRoomServiceImpl implements HostelRoomService {

    private final HostelRoomRepository hostelRoomRepository;
    private final HostelRepository hostelRepository;
    private final StoreRepository storeRepository;
    private final HostelRoomMapper hostelRoomMapper;

    @Override
    public HostelRoomDTO createHostelRoom(HostelRoomDTO hostelRoomDTO) {
        Store store = storeRepository.findById(hostelRoomDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Hostel hostel = hostelRepository.findById(hostelRoomDTO.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found"));

        HostelRoom hostelRoom = hostelRoomMapper.toEntity(hostelRoomDTO, hostel, store);
        return hostelRoomMapper.toDTO(hostelRoomRepository.save(hostelRoom));
    }

    @Override
    @Transactional(readOnly = true)
    public HostelRoomDTO getHostelRoomById(Long id) {
        return hostelRoomRepository.findById(id)
                .map(hostelRoomMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Hostel room not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoomDTO> getAllHostelRooms() {
        return hostelRoomRepository.findAll().stream()
                .map(hostelRoomMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoomDTO> getHostelRoomsByStoreId(Long storeId) {
        return hostelRoomRepository.findByStoreId(storeId).stream()
                .map(hostelRoomMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoomDTO> getHostelRoomsByHostelId(Long hostelId) {
        return hostelRoomRepository.findByHostelId(hostelId).stream()
                .map(hostelRoomMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelRoomDTO> getHostelRoomsByStatus(RentalStatus status) {
        return hostelRoomRepository.findByStatus(status).stream()
                .map(hostelRoomMapper::toDTO)
                .toList();
    }

    @Override
    public HostelRoomDTO updateHostelRoom(Long id, HostelRoomDTO hostelRoomDTO) {
        HostelRoom hostelRoom = hostelRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel room not found"));
        Store store = storeRepository.findById(hostelRoomDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Hostel hostel = hostelRepository.findById(hostelRoomDTO.getHostelId())
                .orElseThrow(() -> new RuntimeException("Hostel not found"));

        hostelRoomMapper.updateEntity(hostelRoom, hostelRoomDTO, hostel, store);
        return hostelRoomMapper.toDTO(hostelRoomRepository.save(hostelRoom));
    }

    @Override
    public void deleteHostelRoom(Long id) {
        if (!hostelRoomRepository.existsById(id)) {
            throw new RuntimeException("Hostel room not found");
        }
        hostelRoomRepository.deleteById(id);
    }
}
