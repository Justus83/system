package com.salesmatrix.repository;

import com.salesmatrix.entity.BarCounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarCounterRepository extends JpaRepository<BarCounter, Long> {
    List<BarCounter> findByStoreId(Long storeId);
    List<BarCounter> findByStoreIdAndActiveTrue(Long storeId);
}
