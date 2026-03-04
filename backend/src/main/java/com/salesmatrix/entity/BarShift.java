package com.salesmatrix.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bar_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarShift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id", nullable = false)
    private BarCounter counter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "shift_start", nullable = false)
    private LocalDateTime shiftStart;

    @Column(name = "shift_end")
    private LocalDateTime shiftEnd;

    @Column(name = "opening_cash", precision = 19, scale = 2, nullable = false)
    private BigDecimal openingCash;

    @Column(name = "closing_cash", precision = 19, scale = 2)
    private BigDecimal closingCash;

    @Column(name = "expected_closing_cash", precision = 19, scale = 2)
    private BigDecimal expectedClosingCash;

    @Column(name = "cash_variance", precision = 19, scale = 2)
    private BigDecimal cashVariance;

    @Column(name = "total_sales", precision = 19, scale = 2)
    private BigDecimal totalSales;

    @Column(name = "total_expenses", precision = 19, scale = 2)
    private BigDecimal totalExpenses;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ShiftStatus status;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "verified_by_next_shift")
    private Boolean verifiedByNextShift;

    @Column(name = "discrepancy_notes", columnDefinition = "TEXT")
    private String discrepancyNotes;

    public enum ShiftStatus {
        ACTIVE, CLOSED
    }

    @PrePersist
    protected void onCreate() {
        if (shiftStart == null) {
            shiftStart = LocalDateTime.now();
        }
        if (status == null) {
            status = ShiftStatus.ACTIVE;
        }
        if (verifiedByNextShift == null) {
            verifiedByNextShift = false;
        }
    }
}
