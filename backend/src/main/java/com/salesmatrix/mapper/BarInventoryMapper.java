package com.salesmatrix.mapper;

import com.salesmatrix.dto.BarInventoryDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BarInventoryMapper {

    private final BeerRepository beerRepository;
    private final SpiritRepository spiritRepository;
    private final WineRepository wineRepository;
    private final ChampagneRepository champagneRepository;
    private final JuiceRepository juiceRepository;
    private final SoftDrinkRepository softDrinkRepository;

    public BarInventoryDTO toDTO(BarInventory inventory) {
        String productName = getProductName(inventory.getProductType(), inventory.getProductId());
        String brandName = getBrandName(inventory.getProductType(), inventory.getProductId());
        String sizeName = getSizeName(inventory.getProductType(), inventory.getProductId());
        String yearName = getYearName(inventory.getProductType(), inventory.getProductId());
        String packagingName = getPackagingName(inventory.getProductType(), inventory.getProductId());

        return BarInventoryDTO.builder()
                .id(inventory.getId())
                .counterId(inventory.getCounter().getId())
                .counterName(inventory.getCounter().getName())
                .productType(inventory.getProductType())
                .productId(inventory.getProductId())
                .productName(productName)
                .brandName(brandName)
                .sizeName(sizeName)
                .yearName(yearName)
                .packagingName(packagingName)
                .quantity(inventory.getQuantity())
                .lastUpdated(inventory.getLastUpdated())
                .build();
    }

    public BarInventory toEntity(BarInventoryDTO dto, BarCounter counter) {
        return BarInventory.builder()
                .counter(counter)
                .productType(dto.getProductType())
                .productId(dto.getProductId())
                .quantity(dto.getQuantity())
                .build();
    }

    public void updateEntity(BarInventory inventory, BarInventoryDTO dto, BarCounter counter) {
        inventory.setCounter(counter);
        inventory.setProductType(dto.getProductType());
        inventory.setProductId(dto.getProductId());
        inventory.setQuantity(dto.getQuantity());
    }

    private String getProductName(BarInventory.ProductType productType, Long productId) {
        switch (productType) {
            case BEER:
                return beerRepository.findById(productId)
                        .map(b -> b.getBrand().getName() + " " + b.getSize().getName())
                        .orElse("Unknown Beer");
            case SPIRIT:
                return spiritRepository.findById(productId)
                        .map(s -> s.getType().getName() + " " + s.getBrand().getName())
                        .orElse("Unknown Spirit");
            case WINE:
                return wineRepository.findById(productId)
                        .map(w -> w.getType().getName() + " " + w.getBrand().getName())
                        .orElse("Unknown Wine");
            case CHAMPAGNE:
                return champagneRepository.findById(productId)
                        .map(c -> c.getBrand().getName())
                        .orElse("Unknown Champagne");
            case JUICE:
                return juiceRepository.findById(productId)
                        .map(j -> j.getBrand().getName())
                        .orElse("Unknown Juice");
            case SOFT_DRINK:
                return softDrinkRepository.findById(productId)
                        .map(sd -> sd.getType().getName())
                        .orElse("Unknown Soft Drink");
            default:
                return "Unknown Product";
        }
    }
    
    private String getBrandName(BarInventory.ProductType productType, Long productId) {
        switch (productType) {
            case BEER:
                return beerRepository.findById(productId)
                        .map(b -> b.getBrand().getName())
                        .orElse("Unknown");
            case SPIRIT:
                return spiritRepository.findById(productId)
                        .map(s -> s.getBrand().getName())
                        .orElse("Unknown");
            case WINE:
                return wineRepository.findById(productId)
                        .map(w -> w.getBrand().getName())
                        .orElse("Unknown");
            case CHAMPAGNE:
                return champagneRepository.findById(productId)
                        .map(c -> c.getBrand().getName())
                        .orElse("Unknown");
            case JUICE:
                return juiceRepository.findById(productId)
                        .map(j -> j.getBrand().getName())
                        .orElse("Unknown");
            case SOFT_DRINK:
                return softDrinkRepository.findById(productId)
                        .map(sd -> sd.getBrand() != null ? sd.getBrand().getName() : "N/A")
                        .orElse("Unknown");
            default:
                return "Unknown";
        }
    }
    
    private String getSizeName(BarInventory.ProductType productType, Long productId) {
        switch (productType) {
            case BEER:
                return beerRepository.findById(productId)
                        .map(b -> b.getSize().getName())
                        .orElse("Unknown");
            case SPIRIT:
                return spiritRepository.findById(productId)
                        .map(s -> s.getSize().getName())
                        .orElse("Unknown");
            case WINE:
                return wineRepository.findById(productId)
                        .map(w -> w.getSize().getName())
                        .orElse("Unknown");
            case CHAMPAGNE:
                return champagneRepository.findById(productId)
                        .map(c -> c.getSize().getName())
                        .orElse("Unknown");
            case JUICE:
                return juiceRepository.findById(productId)
                        .map(j -> j.getSize().getName())
                        .orElse("Unknown");
            case SOFT_DRINK:
                return softDrinkRepository.findById(productId)
                        .map(sd -> sd.getSize().getName())
                        .orElse("Unknown");
            default:
                return "Unknown";
        }
    }
    
    private String getYearName(BarInventory.ProductType productType, Long productId) {
        switch (productType) {
            case SPIRIT:
                return spiritRepository.findById(productId)
                        .map(s -> s.getYear() != null ? s.getYear().getName() : "N/A")
                        .orElse("N/A");
            case WINE:
                return wineRepository.findById(productId)
                        .map(w -> w.getYear() != null ? w.getYear().getName() : "N/A")
                        .orElse("N/A");
            case BEER:
            case CHAMPAGNE:
            case JUICE:
            case SOFT_DRINK:
                return "N/A";
            default:
                return "N/A";
        }
    }
    
    private String getPackagingName(BarInventory.ProductType productType, Long productId) {
        switch (productType) {
            case BEER:
                return beerRepository.findById(productId)
                        .map(b -> b.getPackaging() != null ? b.getPackaging().getName() : "N/A")
                        .orElse("N/A");
            case SPIRIT:
            case WINE:
            case CHAMPAGNE:
            case JUICE:
            case SOFT_DRINK:
                return "N/A";
            default:
                return "N/A";
        }
    }
}

