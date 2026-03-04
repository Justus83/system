package com.salesmatrix.repository;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.TV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TVRepository extends JpaRepository<TV, Long> {

    @Query("SELECT t FROM TV t LEFT JOIN FETCH t.supplier WHERE t.store.id = :storeId")
    List<TV> findByStoreId(@Param("storeId") Long storeId);

    List<TV> findByBrand(BrandEntity brand);

    List<TV> findByModel(String model);

    Optional<TV> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<TV> findBySupplierId(Long supplierId);
}
