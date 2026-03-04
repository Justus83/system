package com.salesmatrix.service;

import com.salesmatrix.dto.SuiteDTO;
import com.salesmatrix.enums.RentalStatus;

import java.util.List;

public interface SuiteService {

    SuiteDTO createSuite(SuiteDTO suiteDTO);

    SuiteDTO getSuiteById(Long id);

    List<SuiteDTO> getAllSuites();

    List<SuiteDTO> getSuitesByStoreId(Long storeId);

    List<SuiteDTO> getSuitesByApartmentId(Long apartmentId);

    List<SuiteDTO> getSuitesByStatus(RentalStatus status);

    SuiteDTO updateSuite(Long id, SuiteDTO suiteDTO);

    void deleteSuite(Long id);
}
