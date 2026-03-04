package com.salesmatrix.repository;

import com.salesmatrix.entity.SpiritTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpiritTypeRepository extends JpaRepository<SpiritTypeEntity, Long> {
    Optional<SpiritTypeEntity> findByName(String name);
    List<SpiritTypeEntity> findByStoreId(Long storeId);
    Optional<SpiritTypeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
