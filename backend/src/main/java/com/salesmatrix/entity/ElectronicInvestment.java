package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electronic_investments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicInvestment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", length = 100)
    private String invoiceNumber;

    @Column(name = "product_details", columnDefinition = "TEXT")
    private String productDetails;

    @Column(name = "investment_date", nullable = false)
    private LocalDateTime investmentDate;

    @Column(name = "total_items", nullable = false)
    @Builder.Default
    private Integer totalItems = 0;

    @Column(name = "items_remaining", nullable = false)
    @Builder.Default
    private Integer itemsRemaining = 0;

    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "balance", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "amount_paid", precision = 15, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal amountPaid = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private ElectronicInvestmentStatus status = ElectronicInvestmentStatus.ACTIVE;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_by")
    private Integer createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Column(name = "total_quantity", nullable = false)
    @Builder.Default
    private Integer totalQuantity = 0;

    @Column(name = "items_received", nullable = false)
    @Builder.Default
    private Integer itemsReceived = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition")
    @Builder.Default
    private ProductCondition productCondition = ProductCondition.BOXED;

    public enum ElectronicInvestmentStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    public enum ProductCondition {
        BOXED,
        USED
    }
}

