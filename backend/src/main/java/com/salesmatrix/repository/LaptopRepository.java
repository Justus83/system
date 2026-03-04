package com.salesmatrix.repository;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Laptop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LaptopRepository extends JpaRepository<Laptop, Long> {

    @Query("SELECT l FROM Laptop l LEFT JOIN FETCH l.supplier WHERE l.store.id = :storeId")
    List<Laptop> findByStoreId(@Param("storeId") Long storeId);

    List<Laptop> findByBrand(BrandEntity brand);

    List<Laptop> findByModel(String model);

    Optional<Laptop> findBySerialNumber(String serialNumber);

    boolean existsBySerialNumber(String serialNumber);

    List<Laptop> findBySupplierId(Long supplierId);
}
