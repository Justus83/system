package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicSupplierReturn;
import com.salesmatrix.enums.ElectronicSupplierReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ElectronicSupplierReturnRepository extends JpaRepository<ElectronicSupplierReturn, Long> {

    List<ElectronicSupplierReturn> findBySupplierId(Long supplierId);

    List<ElectronicSupplierReturn> findByElectronicProductId(Long electronicProductId);

    List<ElectronicSupplierReturn> findByStatus(ElectronicSupplierReturnStatus status);

    @Query("SELECT sr FROM ElectronicSupplierReturn sr WHERE sr.supplier.id = :supplierId AND sr.status = :status")
    List<ElectronicSupplierReturn> findBySupplierIdAndStatus(@Param("supplierId") Long supplierId, @Param("status") ElectronicSupplierReturnStatus status);

    @Query("SELECT sr FROM ElectronicSupplierReturn sr WHERE sr.returnDate BETWEEN :startDate AND :endDate")
    List<ElectronicSupplierReturn> findByReturnDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sr FROM ElectronicSupplierReturn sr WHERE sr.supplier.id = :supplierId AND sr.returnDate BETWEEN :startDate AND :endDate")
    List<ElectronicSupplierReturn> findBySupplierIdAndReturnDateBetween(@Param("supplierId") Long supplierId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT sr FROM ElectronicSupplierReturn sr JOIN FETCH sr.supplier JOIN FETCH sr.electronicProduct")
    List<ElectronicSupplierReturn> findAllWithSupplierAndProduct();

    @Query("SELECT sr FROM ElectronicSupplierReturn sr JOIN FETCH sr.supplier JOIN FETCH sr.electronicProduct WHERE sr.id = :id")
    ElectronicSupplierReturn findByIdWithSupplierAndProduct(@Param("id") Long id);

    @Query("SELECT COUNT(sr) FROM ElectronicSupplierReturn sr WHERE sr.status = :status")
    Long countByStatus(@Param("status") ElectronicSupplierReturnStatus status);

    @Query("SELECT COUNT(sr) FROM ElectronicSupplierReturn sr WHERE sr.supplier.id = :supplierId")
    Long countBySupplierId(@Param("supplierId") Long supplierId);

    boolean existsByElectronicProductIdAndStatus(Long electronicProductId, ElectronicSupplierReturnStatus status);
}
