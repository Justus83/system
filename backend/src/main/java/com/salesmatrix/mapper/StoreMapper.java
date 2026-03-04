package com.salesmatrix.mapper;

import com.salesmatrix.dto.ShopDTO;
import com.salesmatrix.dto.StoreDTO;
import com.salesmatrix.entity.Shop;
import com.salesmatrix.entity.Store;
import com.salesmatrix.enums.ShopType;
import org.springframework.stereotype.Component;

@Component
public class StoreMapper {

    public Store toEntity(StoreDTO dto, Shop shop) {
        return Store.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .shop(shop)
                .build();
    }

    public StoreDTO toDTO(Store store) {
        ShopType shopType = store.getShop() != null ? store.getShop().getShopType() : null;
        Boolean hasBrokers = store.getShop() != null ? store.getShop().getHasBrokers() : false;
        
        ShopDTO shopDTO = null;
        if (store.getShop() != null) {
            shopDTO = ShopDTO.builder()
                    .id(store.getShop().getId())
                    .shopType(store.getShop().getShopType())
                    .shopTypeName(store.getShop().getShopType() != null ? store.getShop().getShopType().getDisplayName() : null)
                    .hasBrokers(store.getShop().getHasBrokers())
                    .build();
        }
        
        return StoreDTO.builder()
                .id(store.getId())
                .name(store.getName())
                .address(store.getAddress())
                .phoneNumber(store.getPhoneNumber())
                .email(store.getEmail())
                .shopId(store.getShop() != null ? store.getShop().getId() : null)
                .shopType(shopType)
                .shopTypeName(shopType != null ? shopType.getDisplayName() : null)
                .hasBrokers(hasBrokers)
                .shop(shopDTO)
                .build();
    }

    public void updateEntity(Store store, StoreDTO dto, Shop shop) {
        store.setName(dto.getName());
        store.setAddress(dto.getAddress());
        store.setPhoneNumber(dto.getPhoneNumber());
        store.setEmail(dto.getEmail());
        store.setShop(shop);
    }
}
