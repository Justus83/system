package com.salesmatrix.repository;

import com.salesmatrix.entity.RentalHouse;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalHouseRepository extends JpaRepository<RentalHouse, Long> {
    List<RentalHouse> findByStoreId(Long storeId);
    List<RentalHouse> findByStatus(RentalStatus status);
}
