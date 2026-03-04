package com.salesmatrix.repository;

import com.salesmatrix.entity.ScreenSizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScreenSizeRepository extends JpaRepository<ScreenSizeEntity, Long> {
    Optional<ScreenSizeEntity> findByName(String name);
    boolean existsByName(String name);
    List<ScreenSizeEntity> findByStoreId(Long storeId);
    Optional<ScreenSizeEntity> findByNameAndStoreId(String name, Long storeId);
    boolean existsByNameAndStoreId(String name, Long storeId);
}
