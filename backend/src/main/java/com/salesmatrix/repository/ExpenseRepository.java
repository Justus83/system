
package com.salesmatrix.repository;

import com.salesmatrix.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByStoreIdOrderByExpenseDateDesc(Long storeId);

    List<Expense> findByStoreIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            Long storeId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByStoreIdAndExpenseDateBetween(Long storeId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByStoreIdAndExpenseDateEqualsOrderByExpenseDateDesc(
            Long storeId, LocalDate date);

    List<Expense> findByStoreIdAndExpenseDateGreaterThanEqualOrderByExpenseDateDesc(
            Long storeId, LocalDate startDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.store.id = :storeId")
    Double getTotalExpensesByStore(@Param("storeId") Long storeId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.store.id = :storeId AND e.expenseDate BETWEEN :startDate AND :endDate")
    Double getTotalExpensesByStoreAndDateRange(
            @Param("storeId") Long storeId, 
            @Param("startDate") LocalDate startDate, 
            @Param("endDate") LocalDate endDate);
}
