package com.salesmatrix.repository;

import com.salesmatrix.entity.ChampagneSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChampagneSizeRepository extends JpaRepository<ChampagneSizeEntity, Long> {
    Optional<ChampagneSizeEntity> findByName(String name);
    List<ChampagneSizeEntity> findByStoreId(Long storeId);
    Optional<ChampagneSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
