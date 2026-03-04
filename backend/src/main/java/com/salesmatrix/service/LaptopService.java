package com.salesmatrix.service;

import com.salesmatrix.dto.LaptopDTO;

import java.util.List;

public interface LaptopService {

    LaptopDTO createLaptop(LaptopDTO laptopDTO);

    LaptopDTO getLaptopById(Long id);

    List<LaptopDTO> getAllLaptops();

    List<LaptopDTO> getLaptopsByStoreId(Long storeId);

    List<LaptopDTO> getLaptopsByBrand(String brand);

    LaptopDTO getLaptopBySerialNumber(String serialNumber);

    LaptopDTO updateLaptop(Long id, LaptopDTO laptopDTO);

    void deleteLaptop(Long id);
}
