package com.salesmatrix.repository;

import com.salesmatrix.entity.Wine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WineRepository extends JpaRepository<Wine, Long> {
    List<Wine> findByStoreId(Long storeId);
}
