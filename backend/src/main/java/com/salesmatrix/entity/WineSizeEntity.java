package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_size")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineSizeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;
}
