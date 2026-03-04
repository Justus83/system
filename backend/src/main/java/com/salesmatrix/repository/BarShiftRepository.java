package com.salesmatrix.repository;

import com.salesmatrix.entity.BarShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarShiftRepository extends JpaRepository<BarShift, Long> {

    List<BarShift> findByCounterId(Long counterId);

    List<BarShift> findByUserId(Long userId);

    List<BarShift> findByStatus(BarShift.ShiftStatus status);

    @Query("SELECT s FROM BarShift s WHERE s.counter.id = :counterId AND s.status = :status")
    Optional<BarShift> findActiveShiftByCounter(@Param("counterId") Long counterId, @Param("status") BarShift.ShiftStatus status);

    @Query("SELECT s FROM BarShift s WHERE s.counter.id = :counterId AND s.status = 'CLOSED' ORDER BY s.shiftEnd DESC")
    Optional<BarShift> findLastClosedShiftByCounter(@Param("counterId") Long counterId);

    @Query("SELECT s FROM BarShift s WHERE s.counter.store.id = :storeId")
    List<BarShift> findByStoreId(@Param("storeId") Long storeId);

    @Query("SELECT s FROM BarShift s WHERE s.shiftStart BETWEEN :startDate AND :endDate")
    List<BarShift> findByShiftStartBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT s FROM BarShift s WHERE s.counter.id = :counterId AND s.shiftStart BETWEEN :startDate AND :endDate")
    List<BarShift> findByCounterIdAndShiftStartBetween(@Param("counterId") Long counterId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
