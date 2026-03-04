package com.salesmatrix.service.impl;

import com.salesmatrix.dto.PaymentDTO;
import com.salesmatrix.entity.ElectronicSale;
import com.salesmatrix.entity.Payment;
import com.salesmatrix.entity.User;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.PaymentMapper;
import com.salesmatrix.repository.ElectronicSaleRepository;
import com.salesmatrix.repository.PaymentRepository;
import com.salesmatrix.repository.UserRepository;
import com.salesmatrix.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ElectronicSaleRepository saleRepository;
    private final UserRepository userRepository;
    private final PaymentMapper paymentMapper;

    @Override
    @Transactional
    public PaymentDTO createPayment(PaymentDTO paymentDTO, Long userId) {
        Payment payment = new Payment();
        payment.setPaymentAmount(paymentDTO.getPaymentAmount());
        payment.setPaymentDate(paymentDTO.getPaymentDate() != null ? paymentDTO.getPaymentDate() : LocalDateTime.now());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());

        if (paymentDTO.getElectronicSaleId() != null) {
            ElectronicSale sale = saleRepository.findById(paymentDTO.getElectronicSaleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + paymentDTO.getElectronicSaleId()));
            payment.setElectronicSale(sale);

            BigDecimal newAmountPaid = sale.getAmountPaid().add(paymentDTO.getPaymentAmount());
            BigDecimal newBalanceDue = sale.getBalanceDue().subtract(paymentDTO.getPaymentAmount());
            
            if (newBalanceDue.compareTo(BigDecimal.ZERO) < 0) {
                newBalanceDue = BigDecimal.ZERO;
            }
            
            sale.setAmountPaid(newAmountPaid);
            sale.setBalanceDue(newBalanceDue);
            saleRepository.save(sale);
        }

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            payment.setCreatedBy(user);
        }

        Payment savedPayment = paymentRepository.save(payment);
        return paymentMapper.toDTO(savedPayment);
    }

    @Override
    public List<PaymentDTO> getPaymentsBySaleId(Long saleId) {
        List<Payment> payments = paymentRepository.findByElectronicSaleIdOrderByPaymentDateDesc(saleId);
        return paymentMapper.toDTOList(payments);
    }

    @Override
    public List<PaymentDTO> getPaymentsByBrokerTransactionId(Long brokerTransactionId) {
        return List.of();
    }

    @Override
    public PaymentDTO getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return paymentMapper.toDTO(payment);
    }

    @Override
    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        if (payment.getElectronicSale() != null) {
            ElectronicSale sale = payment.getElectronicSale();
            BigDecimal newAmountPaid = sale.getAmountPaid().subtract(payment.getPaymentAmount());
            BigDecimal newBalanceDue = sale.getBalanceDue().add(payment.getPaymentAmount());
            
            if (newAmountPaid.compareTo(BigDecimal.ZERO) < 0) {
                newAmountPaid = BigDecimal.ZERO;
            }
            if (newBalanceDue.compareTo(BigDecimal.ZERO) < 0) {
                newBalanceDue = BigDecimal.ZERO;
            }
            
            sale.setAmountPaid(newAmountPaid);
            sale.setBalanceDue(newBalanceDue);
            saleRepository.save(sale);
        }

        paymentRepository.delete(payment);
    }
}
