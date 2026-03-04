package com.salesmatrix.repository;

import com.salesmatrix.entity.Beer;
import com.salesmatrix.entity.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BeerRepository extends JpaRepository<Beer, Long> {

    List<Beer> findByStoreId(Long storeId);

    List<Beer> findByBrand(BrandEntity brand);

    @Query("SELECT b FROM Beer b WHERE b.brand.id = :brandId AND b.size.id = :sizeId AND b.packaging.id = :packagingId AND b.store.id = :storeId")
    List<Beer> findByBrandAndSizeAndPackagingAndStore(
        @Param("brandId") Long brandId, 
        @Param("sizeId") Long sizeId, 
        @Param("packagingId") Long packagingId,
        @Param("storeId") Long storeId
    );
}
