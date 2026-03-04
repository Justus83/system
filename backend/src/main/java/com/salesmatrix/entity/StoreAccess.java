package com.salesmatrix.entity;

import com.salesmatrix.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "store_access")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
