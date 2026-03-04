package com.salesmatrix.repository;

import com.salesmatrix.entity.SpiritSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpiritSizeRepository extends JpaRepository<SpiritSizeEntity, Long> {
    Optional<SpiritSizeEntity> findByName(String name);
}
