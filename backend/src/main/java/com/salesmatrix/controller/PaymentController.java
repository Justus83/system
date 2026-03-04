package com.salesmatrix.controller;

import com.salesmatrix.dto.PaymentDTO;
import com.salesmatrix.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(
            @RequestBody PaymentDTO paymentDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        Long userId = getUserIdFromUserDetails(userDetails);
        PaymentDTO createdPayment = paymentService.createPayment(paymentDTO, userId);
        return ResponseEntity.ok(createdPayment);
    }

    @GetMapping("/sale/{saleId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsBySaleId(@PathVariable Long saleId) {
        List<PaymentDTO> payments = paymentService.getPaymentsBySaleId(saleId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/broker-transaction/{brokerTransactionId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByBrokerTransactionId(@PathVariable Long brokerTransactionId) {
        List<PaymentDTO> payments = paymentService.getPaymentsByBrokerTransactionId(brokerTransactionId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    private Long getUserIdFromUserDetails(UserDetails userDetails) {
        if (userDetails == null) {
            return null;
        }
        try {
            // Assuming the username is the user ID or we have a custom user details implementation
            return Long.parseLong(userDetails.getUsername());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
