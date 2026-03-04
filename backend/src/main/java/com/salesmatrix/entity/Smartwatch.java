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
public class Smartwatch extends ElectronicProduct {

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private String model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private ColorEntity color;

    @Column(name = "case_size_mm")
    private Integer caseSizeMM;

    @Override
    public String getName() {
        return model;
    }
}
