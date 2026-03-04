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
public class Tablet extends ElectronicProduct {

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private String model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storage_size_id", nullable = false)
    private StorageSizeEntity storageSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ram_size_id")
    private RamSizeEntity ramSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private ColorEntity color;

    @Override
    public String getName() {
        return model;
    }
}
