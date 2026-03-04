package com.salesmatrix.repository;

import com.salesmatrix.entity.Shop;
import com.salesmatrix.enums.ShopType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {

    // Returns Optional<Shop> because shopType is unique
    Optional<Shop> findByShopType(ShopType shopType);
}