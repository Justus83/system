package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SmartwatchDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Smartwatch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.SmartwatchMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.SmartwatchRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.SmartwatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SmartwatchServiceImpl implements SmartwatchService {

    private final SmartwatchRepository smartwatchRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final SmartwatchMapper smartwatchMapper;

    @Override
    public SmartwatchDTO createSmartwatch(SmartwatchDTO smartwatchDTO) {
        Store store = storeRepository.findById(smartwatchDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + smartwatchDTO.getStoreId()));

        Supplier supplier = null;
        if (smartwatchDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(smartwatchDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + smartwatchDTO.getSupplierId()));
        }

        Branch branch = null;
        if (smartwatchDTO.getBranchId() != null) {
            branch = branchRepository.findById(smartwatchDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + smartwatchDTO.getBranchId()));
        }

        if (smartwatchRepository.existsBySerialNumber(smartwatchDTO.getSerialNumber())) {
            throw new BusinessException("Smartwatch with serial number " + smartwatchDTO.getSerialNumber() + " already exists");
        }

        Smartwatch smartwatch = smartwatchMapper.toEntity(smartwatchDTO, store, supplier, branch);
        Smartwatch savedSmartwatch = smartwatchRepository.save(smartwatch);
        return smartwatchMapper.toDTO(savedSmartwatch);
    }

    @Override
    @Transactional(readOnly = true)
    public SmartwatchDTO getSmartwatchById(Long id) {
        Smartwatch smartwatch = smartwatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Smartwatch not found with id: " + id));
        return smartwatchMapper.toDTO(smartwatch);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartwatchDTO> getAllSmartwatches() {
        return smartwatchRepository.findAll()
                .stream()
                .map(smartwatchMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartwatchDTO> getSmartwatchesByStoreId(Long storeId) {
        return smartwatchRepository.findByStoreId(storeId)
                .stream()
                .map(smartwatchMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartwatchDTO> getSmartwatchesByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return smartwatchRepository.findByBrand(brandEntity)
                .stream()
                .map(smartwatchMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SmartwatchDTO getSmartwatchBySerialNumber(String serialNumber) {
        Smartwatch smartwatch = smartwatchRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Smartwatch not found with serial number: " + serialNumber));
        return smartwatchMapper.toDTO(smartwatch);
    }

    @Override
    public SmartwatchDTO updateSmartwatch(Long id, SmartwatchDTO smartwatchDTO) {
        Smartwatch smartwatch = smartwatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Smartwatch not found with id: " + id));

        Store store = storeRepository.findById(smartwatchDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + smartwatchDTO.getStoreId()));

        Supplier supplier = null;
        if (smartwatchDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(smartwatchDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + smartwatchDTO.getSupplierId()));
        }

        Branch branch = null;
        if (smartwatchDTO.getBranchId() != null) {
            branch = branchRepository.findById(smartwatchDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + smartwatchDTO.getBranchId()));
        }

        if (!smartwatch.getSerialNumber().equals(smartwatchDTO.getSerialNumber()) &&
                smartwatchRepository.existsBySerialNumber(smartwatchDTO.getSerialNumber())) {
            throw new BusinessException("Smartwatch with serial number " + smartwatchDTO.getSerialNumber() + " already exists");
        }

        smartwatchMapper.updateEntity(smartwatch, smartwatchDTO, store, supplier, branch);
        Smartwatch updatedSmartwatch = smartwatchRepository.save(smartwatch);
        return smartwatchMapper.toDTO(updatedSmartwatch);
    }

    @Override
    public void deleteSmartwatch(Long id) {
        if (!smartwatchRepository.existsById(id)) {
            throw new ResourceNotFoundException("Smartwatch not found with id: " + id);
        }
        smartwatchRepository.deleteById(id);
    }
}
