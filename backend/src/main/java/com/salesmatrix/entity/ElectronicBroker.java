package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "electronic_brokers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectronicBroker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "shop_name", nullable = false)
    private String shopName;

    @Column
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
}