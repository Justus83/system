package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicReturnDTO;
import com.salesmatrix.enums.ReturnStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ElectronicReturnService {

    ElectronicReturnDTO createReturn(ElectronicReturnDTO returnDTO);

    ElectronicReturnDTO getReturnById(Long id);

    List<ElectronicReturnDTO> getAllReturns();

    List<ElectronicReturnDTO> getReturnsBySaleId(Long saleId);

    List<ElectronicReturnDTO> getReturnsByProductId(Long productId);

    List<ElectronicReturnDTO> getReturnsByStatus(ReturnStatus status);

    List<ElectronicReturnDTO> getReturnsByStoreId(Long storeId);

    List<ElectronicReturnDTO> getReturnsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicReturnDTO> getReturnsByStoreIdAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate);

    ElectronicReturnDTO updateReturn(Long id, ElectronicReturnDTO returnDTO);

    ElectronicReturnDTO processReplacement(Long returnId, Long replacementProductId, String notes);

    ElectronicReturnDTO updateReturnStatus(Long returnId, ReturnStatus newStatus);

    void deleteReturn(Long id);

    Double calculateTotalLossByStoreId(Long storeId);

    Double calculateTotalRefundsByStoreId(Long storeId);

    Long countReturnsByStoreIdAndStatus(Long storeId, ReturnStatus status);

    List<ElectronicReturnDTO> getReplacements();
}
