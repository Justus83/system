package com.salesmatrix;

import com.salesmatrix.entity.Shop;
import com.salesmatrix.enums.ShopType;
import com.salesmatrix.repository.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1) // Run first to create shops before stores
@RequiredArgsConstructor
public class ShopCategoryDataLoader implements CommandLineRunner {

    private final ShopRepository shopRepository;

    @Override
    public void run(String... args) throws Exception {
        // Get all existing shop types from database
        var existingShops = shopRepository.findAll();
        var existingShopTypes = existingShops.stream()
                .map(Shop::getShopType)
                .toList();

        // Add any missing shop types
        for (ShopType type : ShopType.values()) {
            if (!existingShopTypes.contains(type)) {
                Shop shop = new Shop();
                shop.setShopType(type);
                // Set hasBrokers based on shop type
                shop.setHasBrokers(type == ShopType.ELECTRONICS);
                shopRepository.save(shop);
                System.out.println("Created shop: " + type.getDisplayName() + " (hasBrokers: " + shop.getHasBrokers() + ")");
            }
        }

        // Update existing shops if hasBrokers is null
        for (Shop shop : existingShops) {
            if (shop.getHasBrokers() == null) {
                shop.setHasBrokers(shop.getShopType() == ShopType.ELECTRONICS);
                shopRepository.save(shop);
                System.out.println("Updated shop: " + shop.getShopType().getDisplayName() + " (hasBrokers: " + shop.getHasBrokers() + ")");
            }
        }

        System.out.println("Shop initialization complete!");
    }
}