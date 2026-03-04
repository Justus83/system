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
public class Accessory extends ElectronicProduct {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer quantity;

    @Override
    public String getName() {
        return name;
    }
}