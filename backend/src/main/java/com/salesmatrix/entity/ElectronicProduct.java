package com.salesmatrix.entity;

import com.salesmatrix.enums.ProductCondition;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.enums.SourceType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.math.BigDecimal;

import lombok.experimental.SuperBuilder;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class ElectronicProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Abstract methods for polymorphic access to subclass fields
    public abstract String getName();
    
    // Default implementation - can be overridden by subclasses that have serial numbers
    public String getSerialNumber() {
        return null;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private BrandEntity brand;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false)
    private SourceType sourceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(name = "other_source_name")
    private String otherSourceName;

    @Pattern(regexp = "^[+]?[0-9\\s\\-()]+$", message = "Phone number must be valid")
    @Column(name = "other_source_phone_number")
    private String otherSourcePhoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(name = "cost_price", precision = 19, scale = 2)
    private BigDecimal costPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_condition")
    @Builder.Default
    private ProductCondition productCondition = ProductCondition.NEW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.AVAILABLE;

}
