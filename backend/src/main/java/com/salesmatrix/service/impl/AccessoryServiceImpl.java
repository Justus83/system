package com.salesmatrix.service.impl;

import com.salesmatrix.dto.AccessoryDTO;
import com.salesmatrix.entity.Accessory;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.AccessoryMapper;
import com.salesmatrix.repository.AccessoryRepository;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.AccessoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AccessoryServiceImpl implements AccessoryService {

    private final AccessoryRepository accessoryRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final AccessoryMapper accessoryMapper;

    @Override
    public AccessoryDTO createAccessory(AccessoryDTO accessoryDTO) {
        Store store = storeRepository.findById(accessoryDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + accessoryDTO.getStoreId()));

        Supplier supplier = null;
        if (accessoryDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(accessoryDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + accessoryDTO.getSupplierId()));
        }

        Branch branch = null;
        if (accessoryDTO.getBranchId() != null) {
            branch = branchRepository.findById(accessoryDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + accessoryDTO.getBranchId()));
        }

        Accessory accessory = accessoryMapper.toEntity(accessoryDTO, store, supplier, branch);
        Accessory savedAccessory = accessoryRepository.save(accessory);
        return accessoryMapper.toDTO(savedAccessory);
    }

    @Override
    @Transactional(readOnly = true)
    public AccessoryDTO getAccessoryById(Long id) {
        Accessory accessory = accessoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory not found with id: " + id));
        return accessoryMapper.toDTO(accessory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessoryDTO> getAllAccessories() {
        return accessoryRepository.findAll()
                .stream()
                .map(accessoryMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessoryDTO> getAccessoriesByStoreId(Long storeId) {
        return accessoryRepository.findByStoreId(storeId)
                .stream()
                .map(accessoryMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessoryDTO> getAccessoriesByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return accessoryRepository.findByBrand(brandEntity)
                .stream()
                .map(accessoryMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccessoryDTO> getAccessoriesBySupplier(Long supplierId) {
        return accessoryRepository.findBySupplierId(supplierId)
                .stream()
                .map(accessoryMapper::toDTO)
                .toList();
    }

    @Override
    public AccessoryDTO updateAccessory(Long id, AccessoryDTO accessoryDTO) {
        Accessory accessory = accessoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accessory not found with id: " + id));

        Store store = storeRepository.findById(accessoryDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + accessoryDTO.getStoreId()));

        Supplier supplier = null;
        if (accessoryDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(accessoryDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + accessoryDTO.getSupplierId()));
        }

        Branch branch = null;
        if (accessoryDTO.getBranchId() != null) {
            branch = branchRepository.findById(accessoryDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + accessoryDTO.getBranchId()));
        }

        accessoryMapper.updateEntity(accessory, accessoryDTO, store, supplier, branch);
        Accessory updatedAccessory = accessoryRepository.save(accessory);
        return accessoryMapper.toDTO(updatedAccessory);
    }

    @Override
    public void deleteAccessory(Long id) {
        if (!accessoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Accessory not found with id: " + id);
        }
        accessoryRepository.deleteById(id);
    }
}
