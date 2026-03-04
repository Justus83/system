package com.salesmatrix.entity;

import com.salesmatrix.enums.ReturnStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electronic_returns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electronic_sale_id", nullable = false)
    private ElectronicSale electronicSale;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "returned_product_id", nullable = false)
    private ElectronicProduct returnedProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replacement_product_id")
    private ElectronicProduct replacementProduct;

    @Column(name = "return_reason", columnDefinition = "TEXT")
    private String returnReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_status", nullable = false)
    private ReturnStatus returnStatus;

    @Column(name = "return_date", nullable = false)
    private LocalDateTime returnDate;

    @Column(name = "is_replacement", nullable = false)
    @Builder.Default
    private Boolean isReplacement = false;

    @Column(name = "replacement_date")
    private LocalDateTime replacementDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}