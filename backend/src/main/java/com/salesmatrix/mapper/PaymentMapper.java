package com.salesmatrix.mapper;

import com.salesmatrix.dto.PaymentDTO;
import com.salesmatrix.entity.Payment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PaymentMapper {

    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }

        return PaymentDTO.builder()
                .id(payment.getId())
                .electronicSaleId(payment.getElectronicSale() != null ? payment.getElectronicSale().getId() : null)
                .brokerTransactionId(payment.getBrokerTransaction() != null ? payment.getBrokerTransaction().getId() : null)
                .paymentAmount(payment.getPaymentAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .createdById(payment.getCreatedBy() != null ? payment.getCreatedBy().getId() : null)
                .createdByName(payment.getCreatedBy() != null ? payment.getCreatedBy().getName() : null)
                .createdAt(payment.getCreatedAt())
                .build();
    }

    public Payment toEntity(PaymentDTO paymentDTO) {
        if (paymentDTO == null) {
            return null;
        }

        return Payment.builder()
                .id(paymentDTO.getId())
                .paymentAmount(paymentDTO.getPaymentAmount())
                .paymentDate(paymentDTO.getPaymentDate())
                .paymentMethod(paymentDTO.getPaymentMethod())
                .build();
    }

    public List<PaymentDTO> toDTOList(List<Payment> payments) {
        if (payments == null) {
            return null;
        }
        return payments.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
