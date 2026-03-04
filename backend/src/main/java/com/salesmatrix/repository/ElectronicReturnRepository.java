package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicReturn;
import com.salesmatrix.enums.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ElectronicReturnRepository extends JpaRepository<ElectronicReturn, Long> {

    List<ElectronicReturn> findByElectronicSaleId(Long electronicSaleId);

    List<ElectronicReturn> findByReturnedProductId(Long returnedProductId);

    List<ElectronicReturn> findByReplacementProductId(Long replacementProductId);

    List<ElectronicReturn> findByReturnStatus(ReturnStatus returnStatus);

    List<ElectronicReturn> findByReturnDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicReturn> findByIsReplacementTrue();

    @Query("SELECT er FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId")
    List<ElectronicReturn> findByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT er FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId AND er.returnDate BETWEEN :startDate AND :endDate")
    List<ElectronicReturn> findByStoreIdAndReturnDateBetween(
            @Param("storeId") Long storeId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT er FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId AND er.returnStatus = :status")
    List<ElectronicReturn> findByStoreIdAndReturnStatus(
            @Param("storeId") Long storeId,
            @Param("status") ReturnStatus status);

    @Query("SELECT SUM(er.electronicSale.totalAmount) FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId AND er.returnStatus = 'TOTAL_LOSS'")
    Double calculateTotalLossByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT SUM(er.electronicSale.totalAmount) FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId")
    Double calculateTotalRefundsByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT COUNT(er) FROM ElectronicReturn er WHERE er.electronicSale.store.id = :storeId AND er.returnStatus = :status")
    Long countByStoreIdAndReturnStatus(@Param("storeId") Long storeId, @Param("status") ReturnStatus status);

    boolean existsByElectronicSaleId(Long electronicSaleId);

    boolean existsByReturnedProductId(Long returnedProductId);
}
