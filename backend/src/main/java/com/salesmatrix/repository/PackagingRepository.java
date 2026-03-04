package com.salesmatrix.repository;

import com.salesmatrix.entity.PackagingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PackagingRepository extends JpaRepository<PackagingEntity, Long> {
    Optional<PackagingEntity> findByName(String name);
    List<PackagingEntity> findByStoreId(Long storeId);
    Optional<PackagingEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
