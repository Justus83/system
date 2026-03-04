package com.salesmatrix.entity;

import com.salesmatrix.enums.BrokerTransactionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "electronic_broker_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicBrokerTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electronic_product_id", nullable = false)
    private ElectronicProduct electronicProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "broker_id", nullable = false)
    private ElectronicBroker broker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BrokerTransactionStatus status = BrokerTransactionStatus.TAKEN;

    @Column(name = "taken_at")
    private LocalDateTime takenAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @Column(name = "selling_price", precision = 10, scale = 2)
    private java.math.BigDecimal sellingPrice;

    @Column(name = "amount_paid", precision = 10, scale = 2)
    private java.math.BigDecimal amountPaid;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
