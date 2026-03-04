package com.salesmatrix.repository;

import com.salesmatrix.entity.ColorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<ColorEntity, Long> {
    Optional<ColorEntity> findByName(String name);
    boolean existsByName(String name);
    List<ColorEntity> findByStoreId(Long storeId);
    Optional<ColorEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
