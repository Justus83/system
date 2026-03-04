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
public class TV extends ElectronicProduct {

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @Column(nullable = false)
    private String model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_size_id")
    private ScreenSizeEntity screenSize;

    @Column(name = "display_type")
    private String displayType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolution_id")
    private ResolutionEntity resolution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tv_type_id")
    private TVTypeEntity tvType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private ColorEntity color;

    @Override
    public String getName() {
        return model;
    }
}
