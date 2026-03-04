package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contact;

    @Column
    private String address;

    @Column
    private String email;

    @Column(name = "date_of_registration", nullable = false)
    private LocalDate dateOfRegistration;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_house_id")
    private RentalHouse rentalHouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suite_id")
    private Suite suite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_room_id")
    private HostelRoom hostelRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
