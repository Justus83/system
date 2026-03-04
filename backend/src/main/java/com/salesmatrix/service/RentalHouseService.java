package com.salesmatrix.service;

import com.salesmatrix.dto.RentalHouseDTO;
import com.salesmatrix.enums.RentalStatus;

import java.util.List;

public interface RentalHouseService {

    RentalHouseDTO createRentalHouse(RentalHouseDTO rentalHouseDTO);

    RentalHouseDTO getRentalHouseById(Long id);

    List<RentalHouseDTO> getAllRentalHouses();

    List<RentalHouseDTO> getRentalHousesByStoreId(Long storeId);

    List<RentalHouseDTO> getRentalHousesByLandlordId(Long landlordId);

    List<RentalHouseDTO> getRentalHousesByStatus(RentalStatus status);

    RentalHouseDTO updateRentalHouse(Long id, RentalHouseDTO rentalHouseDTO);

    void deleteRentalHouse(Long id);
}
