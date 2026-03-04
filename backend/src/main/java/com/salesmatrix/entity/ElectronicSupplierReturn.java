package com.salesmatrix.entity;

import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "electronic_supplier_returns")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicSupplierReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = true)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "electronic_product_id", nullable = false)
    private ElectronicProduct electronicProduct;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ElectronicSupplierReturnStatus status;

    @Column(name = "return_date", nullable = false)
    private LocalDateTime returnDate;

    @Column(name = "product_value", precision = 19, scale = 2)
    private BigDecimal productValue;

    @Column(name = "return_reason", columnDefinition = "TEXT")
    private String returnReason;

    @Column(name = "replacement_serial_number")
    private String replacementSerialNumber;

    @Column(name = "replacement_reason", columnDefinition = "TEXT")
    private String replacementReason;

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
