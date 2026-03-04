package com.salesmatrix.repository;

import com.salesmatrix.entity.Accessory;
import com.salesmatrix.entity.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccessoryRepository extends JpaRepository<Accessory, Long> {

    @Query("SELECT a FROM Accessory a LEFT JOIN FETCH a.supplier WHERE a.store.id = :storeId")
    List<Accessory> findByStoreId(@Param("storeId") Long storeId);

    List<Accessory> findByBrand(BrandEntity brand);

    List<Accessory> findBySupplierId(Long supplierId);

    List<Accessory> findByNameContainingIgnoreCase(String name);
}
