package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BarSaleDTO;
import com.salesmatrix.dto.BarSaleItemDTO;
import com.salesmatrix.entity.BarCounter;
import com.salesmatrix.entity.BarInventory;
import com.salesmatrix.entity.BarSale;
import com.salesmatrix.entity.BarSaleItem;
import com.salesmatrix.mapper.BarSaleMapper;
import com.salesmatrix.repository.BarCounterRepository;
import com.salesmatrix.repository.BarInventoryRepository;
import com.salesmatrix.repository.BarSaleItemRepository;
import com.salesmatrix.repository.BarSaleRepository;
import com.salesmatrix.service.BarSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BarSaleServiceImpl implements BarSaleService {

    private final BarSaleRepository barSaleRepository;
    private final BarSaleItemRepository barSaleItemRepository;
    private final BarCounterRepository barCounterRepository;
    private final BarInventoryRepository barInventoryRepository;
    private final BarSaleMapper barSaleMapper;

    @Override
    public BarSaleDTO createSale(BarSaleDTO saleDTO) {
        BarCounter counter = barCounterRepository.findById(saleDTO.getCounterId())
                .orElseThrow(() -> new RuntimeException("Counter not found with id: " + saleDTO.getCounterId()));

        // Calculate total if not provided
        if (saleDTO.getTotalAmount() == null) {
            BigDecimal total = saleDTO.getItems().stream()
                    .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            saleDTO.setTotalAmount(total);
        }

        // Create sale
        BarSale sale = barSaleMapper.toEntity(saleDTO, counter);
        BarSale savedSale = barSaleRepository.save(sale);

        // Create sale items and update inventory
        List<BarSaleItem> saleItems = saleDTO.getItems().stream()
                .map(itemDTO -> {
                    // Calculate item total
                    BigDecimal itemTotal = itemDTO.getUnitPrice().multiply(BigDecimal.valueOf(itemDTO.getQuantity()));
                    itemDTO.setTotalPrice(itemTotal);

                    // Update inventory
                    updateInventory(counter.getId(), itemDTO);

                    // Create sale item
                    return barSaleMapper.toItemEntity(itemDTO, savedSale);
                })
                .collect(Collectors.toList());

        List<BarSaleItem> savedItems = barSaleItemRepository.saveAll(saleItems);

        return barSaleMapper.toDTO(savedSale, savedItems);
    }

    private void updateInventory(Long counterId, BarSaleItemDTO itemDTO) {
        BarInventory inventory = barInventoryRepository
                .findByCounterIdAndProductTypeAndProductId(
                        counterId,
                        itemDTO.getProductType(),
                        itemDTO.getProductId()
                )
                .orElseThrow(() -> new RuntimeException(
                        "Product not found in inventory: " + itemDTO.getProductName()
                ));

        int newQuantity = inventory.getQuantity() - itemDTO.getQuantity();
        if (newQuantity < 0) {
            throw new RuntimeException(
                    "Insufficient stock for " + itemDTO.getProductName() +
                    ". Available: " + inventory.getQuantity() +
                    ", Required: " + itemDTO.getQuantity()
            );
        }

        inventory.setQuantity(newQuantity);
        barInventoryRepository.save(inventory);
    }

    @Override
    @Transactional(readOnly = true)
    public BarSaleDTO getSaleById(Long id) {
        BarSale sale = barSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with id: " + id));
        List<BarSaleItem> items = barSaleItemRepository.findBySaleId(id);
        return barSaleMapper.toDTO(sale, items);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getAllSales() {
        return barSaleRepository.findAll().stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getSalesByCounter(Long counterId) {
        return barSaleRepository.findByCounterId(counterId).stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getSalesByStore(Long storeId) {
        return barSaleRepository.findByStoreId(storeId).stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getSalesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return barSaleRepository.findBySaleDateBetween(startDate, endDate).stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getSalesByCounterAndDateRange(Long counterId, LocalDateTime startDate, LocalDateTime endDate) {
        return barSaleRepository.findByCounterIdAndSaleDateBetween(counterId, startDate, endDate).stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BarSaleDTO> getSalesByStoreAndDateRange(Long storeId, LocalDateTime startDate, LocalDateTime endDate) {
        return barSaleRepository.findByStoreIdAndSaleDateBetween(storeId, startDate, endDate).stream()
                .map(sale -> {
                    List<BarSaleItem> items = barSaleItemRepository.findBySaleId(sale.getId());
                    return barSaleMapper.toDTO(sale, items);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSale(Long id) {
        // Note: This doesn't restore inventory. Consider adding inventory restoration logic if needed.
        barSaleRepository.deleteById(id);
    }
}
