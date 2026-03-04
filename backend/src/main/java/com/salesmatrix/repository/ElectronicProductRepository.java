package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectronicProductRepository extends JpaRepository<ElectronicProduct, Long> {

    @Query("SELECT p FROM ElectronicProduct p WHERE p.serialNumber = :serialNumber")
    Optional<ElectronicProduct> findBySerialNumber(@Param("serialNumber") String serialNumber);

    @Query("SELECT p FROM ElectronicProduct p WHERE p.status = :status")
    List<ElectronicProduct> findByStatus(@Param("status") ProductStatus status);

    @Query("SELECT p FROM ElectronicProduct p WHERE p.serialNumber = :serialNumber AND p.status = :status")
    Optional<ElectronicProduct> findBySerialNumberAndStatus(@Param("serialNumber") String serialNumber, @Param("status") ProductStatus status);

    @Query("SELECT COUNT(p) FROM ElectronicProduct p WHERE p.store.id = :storeId")
    Long countByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT COUNT(p) FROM ElectronicProduct p WHERE p.store.id = :storeId AND p.status = :status")
    Long countByStoreIdAndStatus(@Param("storeId") Long storeId, @Param("status") ProductStatus status);
}
