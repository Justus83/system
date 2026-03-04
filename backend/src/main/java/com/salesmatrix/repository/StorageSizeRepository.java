package com.salesmatrix.repository;

import com.salesmatrix.entity.StorageSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StorageSizeRepository extends JpaRepository<StorageSizeEntity, Long> {
    Optional<StorageSizeEntity> findByName(String name);
    boolean existsByName(String name);
    List<StorageSizeEntity> findByStoreId(Long storeId);
    Optional<StorageSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
