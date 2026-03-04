package com.salesmatrix.repository;

import com.salesmatrix.entity.SpiritYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpiritYearRepository extends JpaRepository<SpiritYearEntity, Long> {
    Optional<SpiritYearEntity> findByName(String name);
    List<SpiritYearEntity> findByStoreId(Long storeId);
    Optional<SpiritYearEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
