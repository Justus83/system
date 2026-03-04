package com.salesmatrix.service;

import com.salesmatrix.dto.DashboardAnalyticsDTO;

public interface DashboardAnalyticsService {
    DashboardAnalyticsDTO getAnalytics(Long storeId, Integer year);
}
