package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SupplierDTO;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.mapper.SupplierMapper;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.SupplierService;
import com.salesmatrix.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final StoreRepository storeRepository;
    private final SupplierMapper supplierMapper;
    private final UserContextService userContextService;

    @Override
    public SupplierDTO createSupplier(SupplierDTO supplierDTO) {
        // Use the current user's store if storeId is not provided
        Long storeId = supplierDTO.getStoreId() != null 
            ? supplierDTO.getStoreId() 
            : userContextService.getCurrentUserStoreId();
            
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));
        Supplier supplier = supplierMapper.toEntity(supplierDTO, store);
        Supplier savedSupplier = supplierRepository.save(supplier);
        return supplierMapper.toDTO(savedSupplier);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return supplierMapper.toDTO(supplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierDTO> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(supplierMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierDTO> getSuppliersByStoreId(Long storeId) {
        return supplierRepository.findByStoreId(storeId)
                .stream()
                .map(supplierMapper::toDTO)
                .toList();
    }

    @Override
    public SupplierDTO updateSupplier(Long id, SupplierDTO supplierDTO) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        Store store = storeRepository.findById(supplierDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + supplierDTO.getStoreId()));
        supplierMapper.updateEntity(supplier, supplierDTO, store);
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return supplierMapper.toDTO(updatedSupplier);
    }

    @Override
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }
}