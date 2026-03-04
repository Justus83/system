package com.salesmatrix.service;

import com.salesmatrix.dto.RentPaymentDTO;

import java.util.List;

public interface RentPaymentService {

    RentPaymentDTO createRentPayment(RentPaymentDTO rentPaymentDTO);

    RentPaymentDTO getRentPaymentById(Long id);

    List<RentPaymentDTO> getAllRentPayments();

    List<RentPaymentDTO> getRentPaymentsByStoreId(Long storeId);

    List<RentPaymentDTO> getRentPaymentsByTenantId(Long tenantId);

    RentPaymentDTO updateRentPayment(Long id, RentPaymentDTO rentPaymentDTO);

    void deleteRentPayment(Long id);

    RentPaymentDTO signPayment(Long id, String signedBy);
}
