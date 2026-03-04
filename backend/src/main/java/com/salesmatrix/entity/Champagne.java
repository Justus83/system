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
    @UniqueConstraint(columnNames = {"brand_id", "size_id", "store_id"})
})
public class Champagne extends BarProduct {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id")
    private ChampagneSizeEntity size;

    @Override
    public String getName() {
        return getBrand() != null ? getBrand().getName() + " " + 
               (size != null ? size.getName() : "") : "";
    }
}
