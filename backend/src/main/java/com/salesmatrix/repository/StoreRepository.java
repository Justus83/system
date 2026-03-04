package com.salesmatrix.repository;

import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.ShopType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {

    List<Store> findByShopId(Long shopId);
    
    List<Store> findByShopShopType(ShopType shopType);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(s) FROM Store s WHERE s.id IN (SELECT sa.store.id FROM StoreAccess sa WHERE sa.user.id = :userId AND sa.role = 'OWNER')")
    long countByOwnerUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
