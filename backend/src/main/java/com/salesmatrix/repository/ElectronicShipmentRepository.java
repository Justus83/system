package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectronicShipmentRepository extends JpaRepository<ElectronicShipment, Long> {

    List<ElectronicShipment> findByStoreId(Long storeId);

    List<ElectronicShipment> findByInvoiceId(Long invoiceId);

    List<ElectronicShipment> findByStoreIdOrderByDateDesc(Long storeId);

    List<ElectronicShipment> findAllByOrderByDateDesc();
}
