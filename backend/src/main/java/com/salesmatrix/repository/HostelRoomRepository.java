package com.salesmatrix.repository;

import com.salesmatrix.entity.HostelRoom;
import com.salesmatrix.enums.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelRoomRepository extends JpaRepository<HostelRoom, Long> {
    List<HostelRoom> findByStoreId(Long storeId);
    List<HostelRoom> findByHostelId(Long hostelId);
    List<HostelRoom> findByStatus(RentalStatus status);
    List<HostelRoom> findByHostelIdAndStatus(Long hostelId, RentalStatus status);
}
