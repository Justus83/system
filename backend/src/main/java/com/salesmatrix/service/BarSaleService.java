package com.salesmatrix.service;

import com.salesmatrix.dto.BarSaleDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface BarSaleService {

    BarSaleDTO createSale(BarSaleDTO saleDTO);

    BarSaleDTO getSaleById(Long id);

    List<BarSaleDTO> getAllSales();

    List<BarSaleDTO> getSalesByCounter(Long counterId);

    List<BarSaleDTO> getSalesByStore(Long storeId);

    List<BarSaleDTO> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<BarSaleDTO> getSalesByCounterAndDateRange(Long counterId, LocalDateTime startDate, LocalDateTime endDate);

    List<BarSaleDTO> getSalesByStoreAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate);

    void deleteSale(Long id);
}
