package com.salesmatrix.controller;

import com.salesmatrix.dto.ShopDTO;
import com.salesmatrix.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @GetMapping
    public ResponseEntity<List<ShopDTO>> getAllShops() {
        List<ShopDTO> shops = shopService.getAllShops();
        return ResponseEntity.ok(shops);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopDTO> getShopById(@PathVariable Long id) {
        ShopDTO shop = shopService.getShopById(id);
        return ResponseEntity.ok(shop);
    }

    @GetMapping("/type/{shopType}")
    public ResponseEntity<ShopDTO> getShopByType(@PathVariable String shopType) {
        ShopDTO shop = shopService.getShopByType(shopType);
        return ResponseEntity.ok(shop);
    }
}