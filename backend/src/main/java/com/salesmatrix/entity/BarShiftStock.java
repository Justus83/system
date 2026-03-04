package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bar_shift_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarShiftStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private BarShift shift;

    @Column(name = "product_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private BarInventory.ProductType productType;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "opening_quantity", nullable = false)
    private Integer openingQuantity;

    @Column(name = "closing_quantity")
    private Integer closingQuantity;

    @Column(name = "expected_closing_quantity")
    private Integer expectedClosingQuantity;

    @Column(name = "quantity_variance")
    private Integer quantityVariance;

    @Column(name = "is_opening", nullable = false)
    private Boolean isOpening;
}
