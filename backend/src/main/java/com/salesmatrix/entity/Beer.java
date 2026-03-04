package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"brand_id", "size_id", "packaging_id", "store_id"})
})
public class Beer extends BarProduct {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", nullable = false)
    private BeerSizeEntity size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "packaging_id", nullable = false)
    private PackagingEntity packaging;

    @Override
    public String getName() {
        return getBrand() != null ? getBrand().getName() + " " + 
               (size != null ? size.getName() : "") + " " + 
               (packaging != null ? packaging.getName() : "") : "";
    }
}
