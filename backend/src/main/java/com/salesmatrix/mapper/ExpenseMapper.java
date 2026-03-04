package com.salesmatrix.mapper;

import com.salesmatrix.dto.ExpenseDTO;
import com.salesmatrix.entity.Expense;
import com.salesmatrix.entity.Store;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ExpenseMapper {

    public ExpenseDTO toDTO(Expense expense) {
        if (expense == null) {
            return null;
        }

        return ExpenseDTO.builder()
                .id(expense.getId())
                .expenseDate(expense.getExpenseDate())
                .expenditure(expense.getExpenditure())
                .amount(expense.getAmount())
                .storeId(expense.getStore() != null ? expense.getStore().getId() : null)
                .storeName(expense.getStore() != null ? expense.getStore().getName() : null)
                .description(expense.getDescription())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }

    public Expense toEntity(ExpenseDTO dto, Store store) {
        if (dto == null) {
            return null;
        }

        return Expense.builder()
                .id(dto.getId())
                .expenseDate(dto.getExpenseDate())
                .expenditure(dto.getExpenditure())
                .amount(dto.getAmount())
                .store(store)
                .description(dto.getDescription())
                .build();
    }

    public List<ExpenseDTO> toDTOList(List<Expense> expenses) {
        if (expenses == null) {
            return null;
        }

        List<ExpenseDTO> dtoList = new ArrayList<>();
        for (Expense expense : expenses) {
            dtoList.add(toDTO(expense));
        }
        return dtoList;
    }
}
