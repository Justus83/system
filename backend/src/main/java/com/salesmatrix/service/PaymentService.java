package com.salesmatrix.service;

import com.salesmatrix.dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    
    PaymentDTO createPayment(PaymentDTO paymentDTO, Long userId);
    
    List<PaymentDTO> getPaymentsBySaleId(Long saleId);
    
    List<PaymentDTO> getPaymentsByBrokerTransactionId(Long brokerTransactionId);
    
    PaymentDTO getPaymentById(Long id);
    
    void deletePayment(Long id);
}
