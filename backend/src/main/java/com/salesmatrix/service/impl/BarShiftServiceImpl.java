package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BarShiftDTO;
import com.salesmatrix.dto.BarShiftStockDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.mapper.BarShiftMapper;
import com.salesmatrix.repository.*;
import com.salesmatrix.service.BarShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BarShiftServiceImpl implements BarShiftService {

    private final BarShiftRepository barShiftRepository;
    private final BarShiftStockRepository barShiftStockRepository;
    private final BarCounterRepository barCounterRepository;
    private final UserRepository userRepository;
    private final BarSaleRepository barSaleRepository;
    private final ExpenseRepository expenseRepository;
    private final BarShiftMapper barShiftMapper;

    @Override
    public BarShiftDTO startShift(BarShiftDTO shiftDTO) {
        // Check if there's already an active shift for this counter
        barShiftRepository.findActiveShiftByCounter(shiftDTO.getCounterId(), BarShift.ShiftStatus.ACTIVE)
                .ifPresent(shift -> {
                    throw new RuntimeException("There is already an active shift for this counter. Please close it first.");
                });

        BarCounter counter = barCounterRepository.findById(shiftDTO.getCounterId())
                .orElseThrow(() -> new RuntimeException("Counter not found with id: " + shiftDTO.getCounterId()));

        User user = userRepository.findById(shiftDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + shiftDTO.getUserId()));

        // Create shift
        BarShift shift = barShiftMapper.toEntity(shiftDTO, counter, user);
        shift.setStatus(BarShift.ShiftStatus.ACTIVE);
        shift.setShiftStart(LocalDateTime.now());
        BarShift savedShift = barShiftRepository.save(shift);

        // Save stock items
        List<BarShiftStock> stockItems = shiftDTO.getStockItems().stream()
                .map(stockDTO -> {
                    stockDTO.setIsOpening(true);
                    return barShiftMapper.toStockEntity(stockDTO, savedShift);
                })
                .collect(Collectors.toList());

        List<BarShiftStock> savedStockItems = barShiftStockRepository.saveAll(stockItems);

        return barShiftMapper.toDTO(savedShift, savedStockItems);
    }

    @Override
    public BarShiftDTO endShift(Long shiftId, BarShiftDTO shiftDTO) {
        BarShift shift = barShiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + shiftId));

        if (shift.getStatus() == BarShift.ShiftStatus.CLOSED) {
            throw new RuntimeException("This shift is already closed");
        }

        // Calculate totals
        LocalDateTime shiftStart = shift.getShiftStart();
        LocalDateTime shiftEnd = LocalDateTime.now();

        // Get sales during shift
        List<BarSale> sales = barSaleRepository.findByCounterIdAndSaleDateBetween(
                shift.getCounter().getId(), shiftStart, shiftEnd);
        BigDecimal totalSales = sales.stream()
                .map(BarSale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Get expenses during shift
        List<Expense> expenses = expenseRepository.findByStoreIdAndExpenseDateBetween(
                shift.getCounter().getStore().getId(), 
                shiftStart.toLocalDate(), 
                shiftEnd.toLocalDate());
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate expected closing cash
        BigDecimal expectedClosingCash = shift.getOpeningCash()
                .add(totalSales)
                .subtract(totalExpenses);

        // Calculate cash variance
        BigDecimal cashVariance = shiftDTO.getClosingCash().subtract(expectedClosingCash);

        // Update shift
        shift.setShiftEnd(shiftEnd);
        shift.setClosingCash(shiftDTO.getClosingCash());
        shift.setExpectedClosingCash(expectedClosingCash);
        shift.setCashVariance(cashVariance);
        shift.setTotalSales(totalSales);
        shift.setTotalExpenses(totalExpenses);
        shift.setStatus(BarShift.ShiftStatus.CLOSED);
        shift.setNotes(shiftDTO.getNotes());

        BarShift savedShift = barShiftRepository.save(shift);

        // Get opening stock items
        List<BarShiftStock> openingStockItems = barShiftStockRepository.findByShiftId(shiftId);

        // Update with closing quantities and calculate variances
        for (BarShiftStockDTO closingStockDTO : shiftDTO.getStockItems()) {
            BarShiftStock openingStock = openingStockItems.stream()
                    .filter(s -> s.getProductId().equals(closingStockDTO.getProductId()) 
                            && s.getProductType() == closingStockDTO.getProductType())
                    .findFirst()
                    .orElse(null);

            if (openingStock != null) {
                // Calculate expected closing based on sales
                int soldQuantity = calculateSoldQuantity(sales, closingStockDTO.getProductId(), closingStockDTO.getProductType());
                int expectedClosing = openingStock.getOpeningQuantity() - soldQuantity;
                int variance = closingStockDTO.getClosingQuantity() - expectedClosing;

                openingStock.setClosingQuantity(closingStockDTO.getClosingQuantity());
                openingStock.setExpectedClosingQuantity(expectedClosing);
                openingStock.setQuantityVariance(variance);
            }
        }

        List<BarShiftStock> updatedStockItems = barShiftStockRepository.saveAll(openingStockItems);

        return barShiftMapper.toDTO(savedShift, updatedStockItems);
    }

    private int calculateSoldQuantity(List<BarSale> sales, Long productId, BarInventory.ProductType productType) {
        // This would need to query BarSaleItem to get actual quantities sold
        // For now, returning 0 as placeholder
        return 0;
    }

    @Override
    @Transactional(readOnly = true)
    public BarShiftDTO getShiftById(Long id) {
        BarShift shift = barShiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + id));
        List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(id);
        return barShiftMapper.toDTO(shift, stockItems);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarShiftDTO> getAllShifts() {
        return barShiftRepository.findAll().stream()
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarShiftDTO> getShiftsByCounter(Long counterId) {
        return barShiftRepository.findByCounterId(counterId).stream()
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarShiftDTO> getShiftsByUser(Long userId) {
        return barShiftRepository.findByUserId(userId).stream()
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarShiftDTO> getShiftsByStore(Long storeId) {
        return barShiftRepository.findByStoreId(storeId).stream()
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BarShiftDTO getActiveShiftByCounter(Long counterId) {
        return barShiftRepository.findActiveShiftByCounter(counterId, BarShift.ShiftStatus.ACTIVE)
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public BarShiftDTO getLastClosedShiftByCounter(Long counterId) {
        return barShiftRepository.findLastClosedShiftByCounter(counterId)
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarShiftDTO> getShiftsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return barShiftRepository.findByShiftStartBetween(startDate, endDate).stream()
                .map(shift -> {
                    List<BarShiftStock> stockItems = barShiftStockRepository.findByShiftId(shift.getId());
                    return barShiftMapper.toDTO(shift, stockItems);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteShift(Long id) {
        barShiftStockRepository.deleteByShiftId(id);
        barShiftRepository.deleteById(id);
    }
}
