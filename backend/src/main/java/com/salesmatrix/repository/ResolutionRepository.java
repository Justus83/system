package com.salesmatrix.repository;

import com.salesmatrix.entity.ResolutionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResolutionRepository extends JpaRepository<ResolutionEntity, Long> {
    Optional<ResolutionEntity> findByName(String name);
    boolean existsByName(String name);
    List<ResolutionEntity> findByStoreId(Long storeId);
    Optional<ResolutionEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
