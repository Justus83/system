package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "packaging_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PackagingEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
}
