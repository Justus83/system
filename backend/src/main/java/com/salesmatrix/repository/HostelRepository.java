package com.salesmatrix.repository;

import com.salesmatrix.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {
    List<Hostel> findByStoreId(Long storeId);
}
