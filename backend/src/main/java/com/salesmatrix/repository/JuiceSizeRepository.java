package com.salesmatrix.repository;

import com.salesmatrix.entity.JuiceSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JuiceSizeRepository extends JpaRepository<JuiceSizeEntity, Long> {
    Optional<JuiceSizeEntity> findByName(String name);
    boolean existsByName(String name);
    List<JuiceSizeEntity> findByStoreId(Long storeId);
    Optional<JuiceSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
