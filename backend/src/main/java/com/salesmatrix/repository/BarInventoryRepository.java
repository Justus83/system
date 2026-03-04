package com.salesmatrix.repository;

import com.salesmatrix.entity.BarInventory;
import com.salesmatrix.entity.BarInventory.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarInventoryRepository extends JpaRepository<BarInventory, Long> {

    List<BarInventory> findByCounterId(Long counterId);

    List<BarInventory> findByCounterIdAndProductType(Long counterId, ProductType productType);

    Optional<BarInventory> findByCounterIdAndProductTypeAndProductId(Long counterId, ProductType productType, Long productId);

    @Query("SELECT i FROM BarInventory i WHERE i.counter.store.id = :storeId")
    List<BarInventory> findByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT i FROM BarInventory i WHERE i.counter.store.id = :storeId AND i.productType = :productType")
    List<BarInventory> findByStoreIdAndProductType(@Param("storeId") Long storeId, @Param("productType") ProductType productType);
}

