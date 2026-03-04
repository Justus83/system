package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicInvestment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElectronicInvestmentRepository extends JpaRepository<ElectronicInvestment, Long> {

    List<ElectronicInvestment> findByStoreId(Long storeId);

    List<ElectronicInvestment> findByStatus(ElectronicInvestment.ElectronicInvestmentStatus status);

    List<ElectronicInvestment> findByStoreIdAndStatus(Long storeId, ElectronicInvestment.ElectronicInvestmentStatus status);

    List<ElectronicInvestment> findBySupplierId(Long supplierId);

    Optional<ElectronicInvestment> findByInvoiceNumber(String invoiceNumber);

    List<ElectronicInvestment> findByStoreIdOrderByInvestmentDateDesc(Long storeId);

    List<ElectronicInvestment> findAllByOrderByInvestmentDateDesc();

    List<ElectronicInvestment> findByStoreIdAndInvestmentDateBetween(Long storeId, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate);
}

