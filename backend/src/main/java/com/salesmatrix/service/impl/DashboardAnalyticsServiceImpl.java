package com.salesmatrix.service.impl;

import com.salesmatrix.dto.DashboardAnalyticsDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.enums.ProductStatus;
import com.salesmatrix.repository.*;
import com.salesmatrix.service.DashboardAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsServiceImpl implements DashboardAnalyticsService {

    private final ElectronicSaleRepository saleRepository;
    private final ExpenseRepository expenseRepository;
    private final ElectronicInvestmentRepository investmentRepository;
    private final ElectronicProductRepository productRepository;

    @Override
    public DashboardAnalyticsDTO getAnalytics(Long storeId, Integer year) {
        // Get yearly summary
        DashboardAnalyticsDTO.YearlySummary yearlySummary = calculateYearlySummary(storeId, year);
        
        // Get monthly data
        List<DashboardAnalyticsDTO.MonthlyData> monthlyData = calculateMonthlyData(storeId, year);
        
        // Get top products
        List<DashboardAnalyticsDTO.ProductStats> topProducts = getTopProducts(storeId, year, 10);
        
        // Get least products
        List<DashboardAnalyticsDTO.ProductStats> leastProducts = getLeastProducts(storeId, year, 10);
        
        // Get current stats
        DashboardAnalyticsDTO.CurrentStats currentStats = getCurrentStats(storeId);
        
        return DashboardAnalyticsDTO.builder()
                .yearlySummary(yearlySummary)
                .monthlyData(monthlyData)
                .topProducts(topProducts)
                .leastProducts(leastProducts)
                .currentStats(currentStats)
                .build();
    }

    private DashboardAnalyticsDTO.YearlySummary calculateYearlySummary(Long storeId, Integer year) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        
        // Calculate total sales
        BigDecimal totalSales = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .map(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate profit and loss
        BigDecimal totalProfit = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .map(sale -> sale.getProfit() != null ? sale.getProfit() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalLoss = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .map(sale -> sale.getLoss() != null ? sale.getLoss() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate expenditure
        BigDecimal totalExpenditure = expenseRepository.findByStoreIdAndExpenseDateBetween(
                storeId, 
                startOfYear.toLocalDate(), 
                endOfYear.toLocalDate()
        ).stream()
                .map(expense -> expense.getAmount() != null ? expense.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate investment
        BigDecimal totalInvestment = investmentRepository.findByStoreIdAndInvestmentDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .map(inv -> inv.getTotalAmount() != null ? inv.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate net income: Profit - (Loss + Expenditure)
        BigDecimal netIncome = totalProfit.subtract(totalLoss).subtract(totalExpenditure);
        
        return DashboardAnalyticsDTO.YearlySummary.builder()
                .year(year)
                .totalSales(totalSales)
                .totalProfit(totalProfit)
                .totalLoss(totalLoss)
                .totalExpenditure(totalExpenditure)
                .totalInvestment(totalInvestment)
                .netIncome(netIncome)
                .build();
    }

    private List<DashboardAnalyticsDTO.MonthlyData> calculateMonthlyData(Long storeId, Integer year) {
        List<DashboardAnalyticsDTO.MonthlyData> monthlyData = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            LocalDateTime startOfMonth = LocalDateTime.of(year, month, 1, 0, 0);
            LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
            
            // Calculate monthly sales
            BigDecimal monthlySales = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfMonth, endOfMonth)
                    .stream()
                    .map(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate monthly profit
            BigDecimal monthlyProfit = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfMonth, endOfMonth)
                    .stream()
                    .map(sale -> sale.getProfit() != null ? sale.getProfit() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate monthly loss
            BigDecimal monthlyLoss = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfMonth, endOfMonth)
                    .stream()
                    .map(sale -> sale.getLoss() != null ? sale.getLoss() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate monthly expenditure
            BigDecimal monthlyExpenditure = expenseRepository.findByStoreIdAndExpenseDateBetween(
                    storeId,
                    startOfMonth.toLocalDate(),
                    endOfMonth.toLocalDate()
            ).stream()
                    .map(expense -> expense.getAmount() != null ? expense.getAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate monthly investment
            BigDecimal monthlyInvestment = investmentRepository.findByStoreIdAndInvestmentDateBetween(storeId, startOfMonth, endOfMonth)
                    .stream()
                    .map(inv -> inv.getTotalAmount() != null ? inv.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate net income
            BigDecimal netIncome = monthlyProfit.subtract(monthlyLoss).subtract(monthlyExpenditure);
            
            monthlyData.add(DashboardAnalyticsDTO.MonthlyData.builder()
                    .month(Month.of(month).name())
                    .monthNumber(month)
                    .sales(monthlySales)
                    .profit(monthlyProfit)
                    .loss(monthlyLoss)
                    .expenditure(monthlyExpenditure)
                    .investment(monthlyInvestment)
                    .netIncome(netIncome)
                    .build());
        }
        
        return monthlyData;
    }

    private List<DashboardAnalyticsDTO.ProductStats> getTopProducts(Long storeId, Integer year, int limit) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        
        return saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .filter(sale -> sale.getProduct() != null && sale.getProduct().getBrand() != null)
                .collect(Collectors.groupingBy(
                        sale -> {
                            String brandName = sale.getProduct().getBrand().getName();
                            String productName = sale.getProduct().getName();
                            return brandName + " " + productName;
                        },
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                sales -> {
                                    ElectronicProduct product = sales.get(0).getProduct();
                                    String brandName = product.getBrand().getName();
                                    String productName = product.getName();
                                    String fullName = brandName + " " + productName;
                                    long count = sales.size();
                                    BigDecimal totalRevenue = sales.stream()
                                            .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                                    BigDecimal avgPrice = count > 0 ? totalRevenue.divide(BigDecimal.valueOf(count), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;
                                    
                                    return DashboardAnalyticsDTO.ProductStats.builder()
                                            .brand(brandName)
                                            .deviceModel(productName)
                                            .fullName(fullName)
                                            .salesCount(count)
                                            .totalRevenue(totalRevenue)
                                            .avgPrice(avgPrice)
                                            .build();
                                }
                        )
                ))
                .values()
                .stream()
                .sorted((a, b) -> Long.compare(b.getSalesCount(), a.getSalesCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<DashboardAnalyticsDTO.ProductStats> getLeastProducts(Long storeId, Integer year, int limit) {
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        
        return saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfYear, endOfYear)
                .stream()
                .filter(sale -> sale.getProduct() != null && sale.getProduct().getBrand() != null)
                .collect(Collectors.groupingBy(
                        sale -> {
                            String brandName = sale.getProduct().getBrand().getName();
                            String productName = sale.getProduct().getName();
                            return brandName + " " + productName;
                        },
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                sales -> {
                                    ElectronicProduct product = sales.get(0).getProduct();
                                    String brandName = product.getBrand().getName();
                                    String productName = product.getName();
                                    String fullName = brandName + " " + productName;
                                    long count = sales.size();
                                    BigDecimal totalRevenue = sales.stream()
                                            .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                                    BigDecimal avgPrice = count > 0 ? totalRevenue.divide(BigDecimal.valueOf(count), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;
                                    
                                    return DashboardAnalyticsDTO.ProductStats.builder()
                                            .brand(brandName)
                                            .deviceModel(productName)
                                            .fullName(fullName)
                                            .salesCount(count)
                                            .totalRevenue(totalRevenue)
                                            .avgPrice(avgPrice)
                                            .build();
                                }
                        )
                ))
                .values()
                .stream()
                .sorted((a, b) -> Long.compare(a.getSalesCount(), b.getSalesCount()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private DashboardAnalyticsDTO.CurrentStats getCurrentStats(Long storeId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = LocalDateTime.of(now.getYear(), now.getMonth(), 1, 0, 0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusSeconds(1);
        
        // Current month sales
        BigDecimal currentMonthSales = saleRepository.findByStoreIdAndSaleDateBetween(storeId, startOfMonth, endOfMonth)
                .stream()
                .map(sale -> sale.getTotalAmount() != null ? sale.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Total products
        Long totalProducts = productRepository.countByStoreId(storeId);
        
        // Total sales count
        Long totalSalesCount = saleRepository.countByStoreId(storeId);
        
        // Available products (not sold)
        Long availableProducts = productRepository.countByStoreIdAndStatus(storeId, ProductStatus.AVAILABLE);
        
        return DashboardAnalyticsDTO.CurrentStats.builder()
                .currentMonthSales(currentMonthSales)
                .totalProducts(totalProducts)
                .totalSalesCount(totalSalesCount)
                .availableProducts(availableProducts)
                .build();
    }
}
