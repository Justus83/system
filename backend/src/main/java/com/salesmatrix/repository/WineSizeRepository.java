package com.salesmatrix.repository;

import com.salesmatrix.entity.WineSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WineSizeRepository extends JpaRepository<WineSizeEntity, Long> {
    Optional<WineSizeEntity> findByName(String name);
}
