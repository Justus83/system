package com.salesmatrix.repository;

import com.salesmatrix.entity.BarSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarSaleItemRepository extends JpaRepository<BarSaleItem, Long> {
    
    List<BarSaleItem> findBySaleId(Long saleId);
}
