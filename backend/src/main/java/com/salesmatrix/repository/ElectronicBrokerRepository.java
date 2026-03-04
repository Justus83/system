package com.salesmatrix.repository;

import com.salesmatrix.entity.ElectronicBroker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ElectronicBrokerRepository extends JpaRepository<ElectronicBroker, Long> {

    List<ElectronicBroker> findByStoreId(Long storeId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(eb) FROM ElectronicBroker eb WHERE eb.store.id IN (SELECT sa.store.id FROM StoreAccess sa WHERE sa.user.id = :userId AND sa.role = 'OWNER')")
    long countByOwnerUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}