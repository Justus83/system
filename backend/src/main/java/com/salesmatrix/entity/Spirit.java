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
    @UniqueConstraint(columnNames = {"type_id", "brand_id", "size_id", "store_id"})
})
public class Spirit extends BarProduct {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    private SpiritTypeEntity type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "size_id", nullable = false)
    private SpiritSizeEntity size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "year_id")
    private SpiritYearEntity year;

    @Override
    public String getName() {
        return getBrand() != null ? getBrand().getName() + " " + 
               (type != null ? type.getName() : "") + " " + 
               (size != null ? size.getName() : "") + " " +
               (year != null ? year.getName() : "") : "";
    }
}
