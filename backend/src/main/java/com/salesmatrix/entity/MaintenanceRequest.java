package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id")
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suite_id")
    private Suite suite;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rental_house_id")
    private RentalHouse rentalHouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_room_id")
    private HostelRoom hostelRoom;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, URGENT

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column
    private BigDecimal cost;

    @Column(columnDefinition = "TEXT")
    private String resolution;

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
