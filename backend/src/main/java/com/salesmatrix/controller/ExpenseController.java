package com.salesmatrix.controller;

import com.salesmatrix.dto.ExpenseDTO;
import com.salesmatrix.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        ExpenseDTO expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStoreId(@PathVariable Long storeId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByStoreId(storeId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/store/{storeId}/date-range")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStoreIdAndDateRange(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByStoreIdAndDateRange(storeId, startDate, endDate);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/store/{storeId}/date")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStoreIdAndDate(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        // 根据门店ID和日期获取对应的费用列表
        List<ExpenseDTO> expenses = expenseService.getExpensesByStoreIdAndDate(storeId, date);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/store/{storeId}/from-date")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByStoreIdAndDateGreaterThanEqual(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByStoreIdAndDateGreaterThanEqual(storeId, startDate);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/store/{storeId}/total")
    public ResponseEntity<Double> getTotalExpensesByStore(@PathVariable Long storeId) {
        Double total = expenseService.getTotalExpensesByStore(storeId);
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @GetMapping("/store/{storeId}/total/date-range")
    public ResponseEntity<Double> getTotalExpensesByStoreAndDateRange(
            @PathVariable Long storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Double total = expenseService.getTotalExpensesByStoreAndDateRange(storeId, startDate, endDate);
        return ResponseEntity.ok(total != null ? total : 0.0);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO updatedExpense = expenseService.updateExpense(id, expenseDTO);
        return ResponseEntity.ok(updatedExpense);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
