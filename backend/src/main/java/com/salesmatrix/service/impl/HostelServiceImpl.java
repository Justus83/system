package com.salesmatrix.service.impl;

import com.salesmatrix.dto.HostelDTO;
import com.salesmatrix.entity.Hostel;
import com.salesmatrix.entity.Store;
import com.salesmatrix.mapper.HostelMapper;
import com.salesmatrix.repository.HostelRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.service.HostelService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class HostelServiceImpl implements HostelService {

    private final HostelRepository hostelRepository;
    private final StoreRepository storeRepository;
    private final HostelMapper hostelMapper;

    @Override
    public HostelDTO createHostel(HostelDTO hostelDTO) {
        Store store = storeRepository.findById(hostelDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        Hostel hostel = hostelMapper.toEntity(hostelDTO, store);
        return hostelMapper.toDTO(hostelRepository.save(hostel));
    }

    @Override
    @Transactional(readOnly = true)
    public HostelDTO getHostelById(Long id) {
        return hostelRepository.findById(id)
                .map(hostelMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelDTO> getAllHostels() {
        return hostelRepository.findAll().stream()
                .map(hostelMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelDTO> getHostelsByStoreId(Long storeId) {
        return hostelRepository.findByStoreId(storeId).stream()
                .map(hostelMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostelDTO> getHostelsByLandlordId(Long landlordId) {
        // Method kept for interface compatibility but no longer used
        return List.of();
    }

    @Override
    public HostelDTO updateHostel(Long id, HostelDTO hostelDTO) {
        Hostel hostel = hostelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hostel not found"));
        Store store = storeRepository.findById(hostelDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));

        hostelMapper.updateEntity(hostel, hostelDTO, store);
        return hostelMapper.toDTO(hostelRepository.save(hostel));
    }

    @Override
    public void deleteHostel(Long id) {
        if (!hostelRepository.existsById(id)) {
            throw new RuntimeException("Hostel not found");
        }
        hostelRepository.deleteById(id);
    }
}
