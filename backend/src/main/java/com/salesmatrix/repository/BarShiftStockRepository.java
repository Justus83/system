package com.salesmatrix.repository;

import com.salesmatrix.entity.BarShiftStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarShiftStockRepository extends JpaRepository<BarShiftStock, Long> {

    List<BarShiftStock> findByShiftId(Long shiftId);

    void deleteByShiftId(Long shiftId);
}
