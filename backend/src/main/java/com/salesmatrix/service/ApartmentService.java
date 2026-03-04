package com.salesmatrix.service;

import com.salesmatrix.dto.ApartmentDTO;

import java.util.List;

public interface ApartmentService {

    ApartmentDTO createApartment(ApartmentDTO apartmentDTO);

    ApartmentDTO getApartmentById(Long id);

    List<ApartmentDTO> getAllApartments();

    List<ApartmentDTO> getApartmentsByStoreId(Long storeId);

    List<ApartmentDTO> getApartmentsByLandlordId(Long landlordId);

    ApartmentDTO updateApartment(Long id, ApartmentDTO apartmentDTO);

    void deleteApartment(Long id);
}
