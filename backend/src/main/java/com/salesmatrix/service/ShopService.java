package com.salesmatrix.service;

import com.salesmatrix.dto.ShopDTO;
import java.util.List;

public interface ShopService {

    ShopDTO getShopById(Long id);

    List<ShopDTO> getAllShops();

    // Get shop by its type (which is essentially the shop name)
    ShopDTO getShopByType(String shopType);
}