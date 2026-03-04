package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BarInventoryDTO;
import com.salesmatrix.entity.BarCounter;
import com.salesmatrix.entity.BarInventory;
import com.salesmatrix.entity.BarInventory.ProductType;
import com.salesmatrix.mapper.BarInventoryMapper;
import com.salesmatrix.repository.BarCounterRepository;
import com.salesmatrix.repository.BarInventoryRepository;
import com.salesmatrix.service.BarInventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BarInventoryServiceImpl implements BarInventoryService {

    private final BarInventoryRepository barInventoryRepository;
    private final BarCounterRepository barCounterRepository;
    private final BarInventoryMapper barInventoryMapper;

    @Override
    public BarInventoryDTO createOrUpdateInventory(BarInventoryDTO inventoryDTO) {
        BarCounter counter = barCounterRepository.findById(inventoryDTO.getCounterId())
                .orElseThrow(() -> new RuntimeException("Counter not found with id: " + inventoryDTO.getCounterId()));

        BarInventory inventory;
        if (inventoryDTO.getId() != null) {
            // Editing existing inventory - replace quantity
            inventory = barInventoryRepository.findById(inventoryDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + inventoryDTO.getId()));
            barInventoryMapper.updateEntity(inventory, inventoryDTO, counter);
        } else {
            // Adding new stock - check if product already exists
            inventory = barInventoryRepository.findByCounterIdAndProductTypeAndProductId(
                    inventoryDTO.getCounterId(),
                    inventoryDTO.getProductType(),
                    inventoryDTO.getProductId()
            ).map(existingInventory -> {
                // Product exists - add to existing quantity
                existingInventory.setQuantity(existingInventory.getQuantity() + inventoryDTO.getQuantity());
                return existingInventory;
            }).orElseGet(() -> barInventoryMapper.toEntity(inventoryDTO, counter));
        }

        BarInventory savedInventory = barInventoryRepository.save(inventory);
        return barInventoryMapper.toDTO(savedInventory);
    }

    @Override
    @Transactional(readOnly = true)
    public BarInventoryDTO getInventoryById(Long id) {
        BarInventory inventory = barInventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        return barInventoryMapper.toDTO(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryDTO> getInventoryByCounterId(Long counterId) {
        return barInventoryRepository.findByCounterId(counterId).stream()
                .map(barInventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryDTO> getInventoryByCounterIdAndProductType(Long counterId, ProductType productType) {
        return barInventoryRepository.findByCounterIdAndProductType(counterId, productType).stream()
                .map(barInventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryDTO> getInventoryByStoreId(Long storeId) {
        return barInventoryRepository.findByStoreId(storeId).stream()
                .map(barInventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryDTO> getInventoryByStoreIdAndProductType(Long storeId, ProductType productType) {
        return barInventoryRepository.findByStoreIdAndProductType(storeId, productType).stream()
                .map(barInventoryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BarInventoryDTO adjustStock(Long counterId, ProductType productType, Long productId, Integer adjustment) {
        BarInventory inventory = barInventoryRepository.findByCounterIdAndProductTypeAndProductId(
                counterId, productType, productId
        ).orElseThrow(() -> new RuntimeException("Inventory not found"));

        inventory.setQuantity(inventory.getQuantity() + adjustment);
        BarInventory savedInventory = barInventoryRepository.save(inventory);
        return barInventoryMapper.toDTO(savedInventory);
    }

    @Override
    public void deleteInventory(Long id) {
        barInventoryRepository.deleteById(id);
    }
}
