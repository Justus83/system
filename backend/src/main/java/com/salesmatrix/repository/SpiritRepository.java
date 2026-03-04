package com.salesmatrix.repository;

import com.salesmatrix.entity.Spirit;
import com.salesmatrix.entity.BrandEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpiritRepository extends JpaRepository<Spirit, Long> {

    List<Spirit> findByStoreId(Long storeId);

    List<Spirit> findByBrand(BrandEntity brand);

    @Query("SELECT s FROM Spirit s WHERE s.type.id = :typeId AND s.brand.id = :brandId AND s.size.id = :sizeId AND s.store.id = :storeId")
    List<Spirit> findByTypeAndBrandAndSizeAndStore(
        @Param("typeId") Long typeId,
        @Param("brandId") Long brandId, 
        @Param("sizeId") Long sizeId,
        @Param("storeId") Long storeId
    );
}
