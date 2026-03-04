package com.salesmatrix.service.impl;

import com.salesmatrix.dto.ShopDTO;
import com.salesmatrix.entity.Shop;
import com.salesmatrix.enums.ShopType;
import com.salesmatrix.repository.ShopRepository;
import com.salesmatrix.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    @Override
    public ShopDTO getShopById(Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shop not found with id: " + id));
        return toDTO(shop);
    }

    @Override
    public List<ShopDTO> getAllShops() {
        return shopRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ShopDTO getShopByType(String shopType) {
        // Convert string to enum (case insensitive)
        Shop shop = shopRepository.findByShopType(ShopType.valueOf(shopType.toUpperCase()))
                .orElseThrow(() -> new RuntimeException("Shop not found with type: " + shopType));
        return toDTO(shop);
    }

    private ShopDTO toDTO(Shop shop) {
        return ShopDTO.builder()
                .id(shop.getId())
                .shopType(shop.getShopType())
                .shopTypeName(shop.getShopType() != null ? shop.getShopType().getDisplayName() : null)
                .hasBrokers(shop.getHasBrokers())
                .build();
    }
}