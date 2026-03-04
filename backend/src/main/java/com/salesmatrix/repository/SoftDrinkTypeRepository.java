package com.salesmatrix.repository;

import com.salesmatrix.entity.SoftDrinkTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SoftDrinkTypeRepository extends JpaRepository<SoftDrinkTypeEntity, Long> {
    Optional<SoftDrinkTypeEntity> findByName(String name);
    List<SoftDrinkTypeEntity> findByStoreId(Long storeId);
    Optional<SoftDrinkTypeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
