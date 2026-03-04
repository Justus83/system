package com.salesmatrix.repository;

import com.salesmatrix.entity.WineTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WineTypeRepository extends JpaRepository<WineTypeEntity, Long> {
    Optional<WineTypeEntity> findByName(String name);
    List<WineTypeEntity> findByStoreId(Long storeId);
    Optional<WineTypeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
