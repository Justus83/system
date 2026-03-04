package com.salesmatrix.repository;

import com.salesmatrix.entity.SoftDrinkSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SoftDrinkSizeRepository extends JpaRepository<SoftDrinkSizeEntity, Long> {
    Optional<SoftDrinkSizeEntity> findByName(String name);
    List<SoftDrinkSizeEntity> findByStoreId(Long storeId);
    Optional<SoftDrinkSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
