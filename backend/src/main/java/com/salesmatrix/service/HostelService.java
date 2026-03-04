package com.salesmatrix.service;

import com.salesmatrix.dto.HostelDTO;

import java.util.List;

public interface HostelService {

    HostelDTO createHostel(HostelDTO hostelDTO);

    HostelDTO getHostelById(Long id);

    List<HostelDTO> getAllHostels();

    List<HostelDTO> getHostelsByStoreId(Long storeId);

    List<HostelDTO> getHostelsByLandlordId(Long landlordId);

    HostelDTO updateHostel(Long id, HostelDTO hostelDTO);

    void deleteHostel(Long id);
}
