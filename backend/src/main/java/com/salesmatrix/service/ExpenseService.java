package com.salesmatrix.service;

import com.salesmatrix.dto.ExpenseDTO;
import com.salesmatrix.entity.Expense;
import com.salesmatrix.entity.Store;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.ExpenseMapper;
import com.salesmatrix.repository.ExpenseRepository;
import com.salesmatrix.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final StoreRepository storeRepository;
    private final ExpenseMapper expenseMapper;

    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        // Validate store
        Store store = storeRepository.findById(expenseDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + expenseDTO.getStoreId()));

        // Set default date if not provided
        if (expenseDTO.getExpenseDate() == null) {
            expenseDTO.setExpenseDate(LocalDate.now());
        }

        Expense expense = expenseMapper.toEntity(expenseDTO, store);
        Expense savedExpense = expenseRepository.save(expense);

        return expenseMapper.toDTO(savedExpense);
    }

    @Transactional(readOnly = true)
    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return expenseMapper.toDTO(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByStoreId(Long storeId) {
        return expenseRepository.findByStoreIdOrderByExpenseDateDesc(storeId).stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByStoreIdAndDateRange(Long storeId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByStoreIdAndExpenseDateBetweenOrderByExpenseDateDesc(storeId, startDate, endDate).stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByStoreIdAndDate(Long storeId, LocalDate date) {
        return expenseRepository.findByStoreIdAndExpenseDateEqualsOrderByExpenseDateDesc(storeId, date).stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExpenseDTO> getExpensesByStoreIdAndDateGreaterThanEqual(Long storeId, LocalDate startDate) {
        return expenseRepository.findByStoreIdAndExpenseDateGreaterThanEqualOrderByExpenseDateDesc(storeId, startDate).stream()
                .map(expenseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Double getTotalExpensesByStore(Long storeId) {
        return expenseRepository.getTotalExpensesByStore(storeId);
    }

    @Transactional(readOnly = true)
    public Double getTotalExpensesByStoreAndDateRange(Long storeId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.getTotalExpensesByStoreAndDateRange(storeId, startDate, endDate);
    }

    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        // Update store if provided
        if (expenseDTO.getStoreId() != null) {
            Store store = storeRepository.findById(expenseDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + expenseDTO.getStoreId()));
            existingExpense.setStore(store);
        }

        // Update other fields
        if (expenseDTO.getExpenseDate() != null) {
            existingExpense.setExpenseDate(expenseDTO.getExpenseDate());
        }
        if (expenseDTO.getExpenditure() != null) {
            existingExpense.setExpenditure(expenseDTO.getExpenditure());
        }
        if (expenseDTO.getAmount() != null) {
            existingExpense.setAmount(expenseDTO.getAmount());
        }
        if (expenseDTO.getDescription() != null) {
            existingExpense.setDescription(expenseDTO.getDescription());
        }

        Expense updatedExpense = expenseRepository.save(existingExpense);
        return expenseMapper.toDTO(updatedExpense);
    }

    @Transactional
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }
}
