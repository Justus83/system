package com.salesmatrix.repository;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Smartphone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SmartphoneRepository extends JpaRepository<Smartphone, Long> {

    @Query("SELECT s FROM Smartphone s LEFT JOIN FETCH s.supplier WHERE s.store.id = :storeId")
    List<Smartphone> findByStoreId(@Param("storeId") Long storeId);

    List<Smartphone> findByBrand(BrandEntity brand);

    List<Smartphone> findByModel(String model);

    Optional<Smartphone> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Smartphone> findBySupplierId(Long supplierId);
}
