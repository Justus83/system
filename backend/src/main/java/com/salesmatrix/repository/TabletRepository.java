package com.salesmatrix.repository;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Tablet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TabletRepository extends JpaRepository<Tablet, Long> {

    @Query("SELECT t FROM Tablet t LEFT JOIN FETCH t.supplier WHERE t.store.id = :storeId")
    List<Tablet> findByStoreId(@Param("storeId") Long storeId);

    List<Tablet> findByBrand(BrandEntity brand);

    List<Tablet> findByModel(String model);

    Optional<Tablet> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Tablet> findBySupplierId(Long supplierId);
}
