package com.salesmatrix.repository;

import com.salesmatrix.entity.Champagne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChampagneRepository extends JpaRepository<Champagne, Long> {
    List<Champagne> findByStoreId(Long storeId);
}
