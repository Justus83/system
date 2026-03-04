package com.salesmatrix.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardAnalyticsDTO {
    
    private YearlySummary yearlySummary;
    private List<MonthlyData> monthlyData;
    private List<ProductStats> topProducts;
    private List<ProductStats> leastProducts;
    private CurrentStats currentStats;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class YearlySummary {
        private Integer year;
        private BigDecimal totalSales;
        private BigDecimal totalProfit;
        private BigDecimal totalLoss;
        private BigDecimal totalExpenditure;
        private BigDecimal totalInvestment;
        private BigDecimal netIncome;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyData {
        private String month;
        private Integer monthNumber;
        private BigDecimal sales;
        private BigDecimal profit;
        private BigDecimal loss;
        private BigDecimal expenditure;
        private BigDecimal investment;
        private BigDecimal netIncome;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductStats {
        private String deviceModel;
        private String brand;
        private String fullName;
        private Long salesCount;
        private BigDecimal totalRevenue;
        private BigDecimal avgPrice;
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CurrentStats {
        private BigDecimal currentMonthSales;
        private Long totalProducts;
        private Long totalSalesCount;
        private Long availableProducts;
    }
}
