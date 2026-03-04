package com.salesmatrix.repository;

import com.salesmatrix.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    
    @Query("SELECT t FROM Tenant t " +
           "LEFT JOIN FETCH t.store " +
           "LEFT JOIN FETCH t.rentalHouse " +
           "LEFT JOIN FETCH t.suite s " +
           "LEFT JOIN FETCH s.apartment " +
           "LEFT JOIN FETCH t.hostelRoom hr " +
           "LEFT JOIN FETCH hr.hostel " +
           "WHERE t.id = :id")
    Optional<Tenant> findByIdWithRelations(@Param("id") Long id);
    
    @Query("SELECT t FROM Tenant t " +
           "LEFT JOIN FETCH t.store " +
           "LEFT JOIN FETCH t.rentalHouse " +
           "LEFT JOIN FETCH t.suite s " +
           "LEFT JOIN FETCH s.apartment " +
           "LEFT JOIN FETCH t.hostelRoom hr " +
           "LEFT JOIN FETCH hr.hostel " +
           "WHERE t.store.id = :storeId")
    List<Tenant> findByStoreIdWithRelations(@Param("storeId") Long storeId);
    
    List<Tenant> findByStoreId(Long storeId);
    List<Tenant> findByRentalHouseId(Long rentalHouseId);
    List<Tenant> findBySuiteId(Long suiteId);
    List<Tenant> findByHostelRoomId(Long hostelRoomId);
}
