package com.salesmatrix.repository;

import com.salesmatrix.entity.RamSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RamSizeRepository extends JpaRepository<RamSizeEntity, Long> {
    Optional<RamSizeEntity> findByName(String name);
    boolean existsByName(String name);
    List<RamSizeEntity> findByStoreId(Long storeId);
    Optional<RamSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
