package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicSale;
import com.salesmatrix.enums.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ElectronicSaleRepository extends JpaRepository<ElectronicSale, Long> {

    List<ElectronicSale> findByStoreId(Long storeId);

    List<ElectronicSale> findByBranchId(Long branchId);

    List<ElectronicSale> findByCustomerId(Long customerId);

    List<ElectronicSale> findByBrokerId(Long brokerId);

    List<ElectronicSale> findByProductId(Long productId);

    List<ElectronicSale> findByElectronicBrokerTransactionId(Long electronicBrokerTransactionId);

    List<ElectronicSale> findByPaymentMethod(PaymentMethod paymentMethod);

    List<ElectronicSale> findBySaleDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicSale> findByStoreIdAndSaleDateBetween(Long storeId, LocalDateTime startDate, LocalDateTime endDate);

    List<ElectronicSale> findByBranchIdAndSaleDateBetween(Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    Long countByStoreId(Long storeId);
}
