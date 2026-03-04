package com.salesmatrix.repository;

import com.salesmatrix.entity.WineYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WineYearRepository extends JpaRepository<WineYearEntity, Long> {
    Optional<WineYearEntity> findByName(String name);
    List<WineYearEntity> findByStoreId(Long storeId);
    Optional<WineYearEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
