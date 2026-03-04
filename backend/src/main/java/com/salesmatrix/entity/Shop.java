package com.salesmatrix.entity;

import com.salesmatrix.enums.ShopType;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Table(name = "shops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "shop_type", nullable = false, unique = true)
    private ShopType shopType;

    @Column(name = "has_brokers", nullable = false)
    @Builder.Default
    private Boolean hasBrokers = false;
}