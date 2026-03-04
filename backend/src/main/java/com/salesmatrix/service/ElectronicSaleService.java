package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.entity.ElectronicProduct;
import com.salesmatrix.enums.PaymentMethod;

import java.time.LocalDateTime;
import java.util.List;

public interface ElectronicSaleService {

    ElectronicSaleDTO createSale(ElectronicSaleDTO dto);

    ElectronicSaleDTO getSaleById(Long id);

    List<ElectronicSaleDTO> getAllSales();

    List<ElectronicSaleDTO> getSalesByStore(Long storeId);

    List<ElectronicSaleDTO> getSalesByBranch(Long branchId);

    List<ElectronicSaleDTO> getSalesByCustomer(Long customerId);

    List<ElectronicSaleDTO> getSalesByBroker(Long brokerId);

    List<ElectronicSaleDTO> getSalesByProduct(Long productId);

    List<ElectronicSaleDTO> getSalesByPaymentMethod(PaymentMethod paymentMethod);

    List<ElectronicSaleDTO> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicSaleDTO> getSalesByStoreAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicSaleDTO> getSalesByBranchAndDateRange(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    ElectronicSaleDTO updateSale(Long id, ElectronicSaleDTO dto);

    void deleteSale(Long id);

    ElectronicSaleDTO createSaleFromBrokerTransaction(Long brokerTransactionId, Long customerId, 
                                                       PaymentMethod paymentMethod);


    List<ElectronicProduct> getAvailableElectronicProducts();

}
