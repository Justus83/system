package com.salesmatrix.repository;

import com.salesmatrix.entity.BarSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BarSaleRepository extends JpaRepository<BarSale, Long> {
    
    List<BarSale> findByCounterId(Long counterId);
    
    List<BarSale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT s FROM BarSale s WHERE s.counter.id = :counterId AND s.saleDate BETWEEN :startDate AND :endDate")
    List<BarSale> findByCounterIdAndSaleDateBetween(
        @Param("counterId") Long counterId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT s FROM BarSale s WHERE s.counter.store.id = :storeId")
    List<BarSale> findByStoreId(@Param("storeId") Long storeId);
    
    @Query("SELECT s FROM BarSale s WHERE s.counter.store.id = :storeId AND s.saleDate BETWEEN :startDate AND :endDate")
    List<BarSale> findByStoreIdAndSaleDateBetween(
        @Param("storeId") Long storeId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
