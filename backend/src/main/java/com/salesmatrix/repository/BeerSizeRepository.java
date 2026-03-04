package com.salesmatrix.repository;

import com.salesmatrix.entity.BeerSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BeerSizeRepository extends JpaRepository<BeerSizeEntity, Long> {
    Optional<BeerSizeEntity> findByName(String name);
    List<BeerSizeEntity> findByStoreId(Long storeId);
    Optional<BeerSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
