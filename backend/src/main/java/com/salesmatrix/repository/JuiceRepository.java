package com.salesmatrix.repository;

import com.salesmatrix.entity.Juice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JuiceRepository extends JpaRepository<Juice, Long> {
    List<Juice> findByStoreId(Long storeId);
}
