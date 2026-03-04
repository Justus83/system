package com.salesmatrix.repository;


import com.salesmatrix.entity.*;
import com.salesmatrix.enums.BrokerTransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectronicBrokerTransactionRepository extends JpaRepository<ElectronicBrokerTransaction, Long> {

    @Query("SELECT DISTINCT t FROM ElectronicBrokerTransaction t " +
           "LEFT JOIN FETCH t.electronicProduct p " +
           "LEFT JOIN FETCH t.store " +
           "LEFT JOIN FETCH t.broker " +
           "WHERE t.store = :store")
    List<ElectronicBrokerTransaction> findByStoreWithProduct(@Param("store") Store store);

    List<ElectronicBrokerTransaction> findByStore(Store store);

    List<ElectronicBrokerTransaction> findByBranch(Branch branch);

    List<ElectronicBrokerTransaction> findByBroker(ElectronicBroker broker);

    List<ElectronicBrokerTransaction> findByElectronicProduct(ElectronicProduct electronicProduct);

    List<ElectronicBrokerTransaction> findByStatus(BrokerTransactionStatus status);

    List<ElectronicBrokerTransaction> findByStoreAndStatus(Store store, BrokerTransactionStatus status);

    List<ElectronicBrokerTransaction> findByBranchAndStatus(Branch branch, BrokerTransactionStatus status);

    List<ElectronicBrokerTransaction> findByBrokerAndStatus(ElectronicBroker broker, BrokerTransactionStatus status);
}
