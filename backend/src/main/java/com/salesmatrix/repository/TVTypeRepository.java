package com.salesmatrix.repository;

import com.salesmatrix.entity.TVTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TVTypeRepository extends JpaRepository<TVTypeEntity, Long> {
    Optional<TVTypeEntity> findByName(String name);
    List<TVTypeEntity> findByStoreId(Long storeId);
    Optional<TVTypeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
