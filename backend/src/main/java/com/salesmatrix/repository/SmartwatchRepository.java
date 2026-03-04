package com.salesmatrix.repository;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Smartwatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SmartwatchRepository extends JpaRepository<Smartwatch, Long> {

    @Query("SELECT s FROM Smartwatch s LEFT JOIN FETCH s.supplier WHERE s.store.id = :storeId")
    List<Smartwatch> findByStoreId(@Param("storeId") Long storeId);

    List<Smartwatch> findByBrand(BrandEntity brand);

    List<Smartwatch> findByModel(String model);

    Optional<Smartwatch> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Smartwatch> findBySupplierId(Long supplierId);
}
