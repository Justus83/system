package com.salesmatrix.entity;

import com.salesmatrix.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electronic_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electronic_product_id", nullable = false)
    private ElectronicProduct product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = true)
    private Branch branch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "broker_id")
    private ElectronicBroker broker;

    // Historical price snapshots - stored at time of sale for accurate profit/loss tracking
    @Column(name = "cost_price_at_sale", nullable = false, precision = 19, scale = 2)
    private BigDecimal costPriceAtSale;

    @Column(name = "sale_price", nullable = false, precision = 19, scale = 2)
    private BigDecimal salePrice;

    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal totalAmount;

    // Profit/Loss tracking
    @Column(name = "profit", precision = 19, scale = 2)
    private BigDecimal profit;

    @Column(name = "loss", precision = 19, scale = 2)
    private BigDecimal loss;

    // Credit tracking
    @Column(name = "is_credit_sale", nullable = false)
    @Builder.Default
    private Boolean isCreditSale = false;

    @Column(name = "credit_amount", precision = 19, scale = 2)
    private BigDecimal creditAmount;

    @Column(name = "amount_paid", precision = 19, scale = 2)
    @Builder.Default
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Column(name = "balance_due", precision = 19, scale = 2)
    private BigDecimal balanceDue;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "sale_date", nullable = true)
    @CreationTimestamp
    private LocalDateTime saleDate;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electronic_broker_transaction_id")
    private ElectronicBrokerTransaction electronicBrokerTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}
