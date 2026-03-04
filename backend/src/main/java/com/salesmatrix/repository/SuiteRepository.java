package com.salesmatrix.repository;

import com.salesmatrix.entity.Suite;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuiteRepository extends JpaRepository<Suite, Long> {
    List<Suite> findByStoreId(Long storeId);
    List<Suite> findByApartmentId(Long apartmentId);
    List<Suite> findByStatus(RentalStatus status);
    List<Suite> findByApartmentIdAndStatus(Long apartmentId, RentalStatus status);
}
