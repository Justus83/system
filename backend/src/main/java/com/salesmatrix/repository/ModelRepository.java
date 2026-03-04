package com.salesmatrix.repository;

import com.salesmatrix.entity.ModelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<ModelEntity, Long> {
    Optional<ModelEntity> findByName(String name);
    boolean existsByName(String name);
    List<ModelEntity> findByStoreId(Long storeId);
    Optional<ModelEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
