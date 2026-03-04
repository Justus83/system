package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "spirit_size")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpiritSizeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
