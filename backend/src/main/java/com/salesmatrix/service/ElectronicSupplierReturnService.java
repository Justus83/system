package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicSupplierReturnDTO;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ElectronicSupplierReturnService {

    ElectronicSupplierReturnDTO createElectronicSupplierReturn(ElectronicSupplierReturnDTO dto);

    ElectronicSupplierReturnDTO getElectronicSupplierReturnById(Long id);

    List<ElectronicSupplierReturnDTO> getAllElectronicSupplierReturns();

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierId(Long supplierId);

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByProductId(Long productId);

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByStatus(ElectronicSupplierReturnStatus status);

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierIdAndStatus(Long supplierId, ElectronicSupplierReturnStatus status);

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicSupplierReturnDTO> getElectronicSupplierReturnsBySupplierIdAndDateRange(Long supplierId, LocalDateTime startDate, LocalDateTime endDate);

    ElectronicSupplierReturnDTO updateElectronicSupplierReturn(Long id, ElectronicSupplierReturnDTO dto);

    ElectronicSupplierReturnDTO processReplacement(Long returnId, String replacementSerialNumber, String replacementReason);

    ElectronicSupplierReturnDTO updateReturnStatus(Long id, ElectronicSupplierReturnStatus status);

    void deleteElectronicSupplierReturn(Long id);

    Long countByStatus(ElectronicSupplierReturnStatus status);

    Long countBySupplierId(Long supplierId);

    boolean hasPendingReturnForProduct(Long productId);
}
