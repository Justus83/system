package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bar_sales")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", nullable = false)
    private BarCounter counter;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "total_amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "notes")
    private String notes;

    @Column(name = "served_by")
    private String servedBy;

    @PrePersist
    protected void onCreate() {
        if (saleDate == null) {
            saleDate = LocalDateTime.now();
        }
    }
}
