package com.salesmatrix.service.impl;

import com.salesmatrix.dto.SmartphoneDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Smartphone;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.SmartphoneMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.SmartphoneRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.SmartphoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SmartphoneServiceImpl implements SmartphoneService {

    private final SmartphoneRepository smartphoneRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final SmartphoneMapper smartphoneMapper;

    @Override
    public SmartphoneDTO createSmartphone(SmartphoneDTO smartphoneDTO) {
        Store store = storeRepository.findById(smartphoneDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + smartphoneDTO.getStoreId()));

        // Validate sourceType and supplier relationship
        SourceType sourceType = SourceType.valueOf(smartphoneDTO.getSourceType());
        Supplier supplier = null;
        
        if (sourceType == SourceType.SUPPLIER) {
            if (smartphoneDTO.getSupplierId() == null) {
                throw new BusinessException("Supplier ID is required when source type is SUPPLIER");
            }
            supplier = supplierRepository.findById(smartphoneDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + smartphoneDTO.getSupplierId()));
        } else if (sourceType == SourceType.OTHER) {
            if (smartphoneDTO.getOtherSourceName() == null || smartphoneDTO.getOtherSourceName().trim().isEmpty()) {
                throw new BusinessException("Other source name is required when source type is OTHER");
            }
        }

        Branch branch = null;
        if (smartphoneDTO.getBranchId() != null) {
            branch = branchRepository.findById(smartphoneDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + smartphoneDTO.getBranchId()));
        }

        if (smartphoneRepository.existsBySerialNumber(smartphoneDTO.getSerialNumber())) {
            throw new BusinessException("Smartphone with serial number " + smartphoneDTO.getSerialNumber() + " already exists");
        }

        Smartphone smartphone = smartphoneMapper.toEntity(smartphoneDTO, store, supplier, branch);
        Smartphone savedSmartphone = smartphoneRepository.save(smartphone);
        return smartphoneMapper.toDTO(savedSmartphone);
    }

    @Override
    @Transactional(readOnly = true)
    public SmartphoneDTO getSmartphoneById(Long id) {
        Smartphone smartphone = smartphoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Smartphone not found with id: " + id));
        return smartphoneMapper.toDTO(smartphone);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartphoneDTO> getAllSmartphones() {
        return smartphoneRepository.findAll()
                .stream()
                .map(smartphoneMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartphoneDTO> getSmartphonesByStoreId(Long storeId) {
        return smartphoneRepository.findByStoreId(storeId)
                .stream()
                .map(smartphoneMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SmartphoneDTO> getSmartphonesByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return smartphoneRepository.findByBrand(brandEntity)
                .stream()
                .map(smartphoneMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SmartphoneDTO getSmartphoneBySerialNumber(String serialNumber) {
        Smartphone smartphone = smartphoneRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Smartphone not found with serial number: " + serialNumber));
        return smartphoneMapper.toDTO(smartphone);
    }

    @Override
    public SmartphoneDTO updateSmartphone(Long id, SmartphoneDTO smartphoneDTO) {
        Smartphone smartphone = smartphoneRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Smartphone not found with id: " + id));

        Store store = storeRepository.findById(smartphoneDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + smartphoneDTO.getStoreId()));

        Supplier supplier = null;
        if (smartphoneDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(smartphoneDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + smartphoneDTO.getSupplierId()));
        }

        Branch branch = null;
        if (smartphoneDTO.getBranchId() != null) {
            branch = branchRepository.findById(smartphoneDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + smartphoneDTO.getBranchId()));
        }

        if (!smartphone.getSerialNumber().equals(smartphoneDTO.getSerialNumber()) &&
                smartphoneRepository.existsBySerialNumber(smartphoneDTO.getSerialNumber())) {
            throw new BusinessException("Smartphone with serial number " + smartphoneDTO.getSerialNumber() + " already exists");
        }

        smartphoneMapper.updateEntity(smartphone, smartphoneDTO, store, supplier, branch);
        Smartphone updatedSmartphone = smartphoneRepository.save(smartphone);
        return smartphoneMapper.toDTO(updatedSmartphone);
    }

    @Override
    public void deleteSmartphone(Long id) {
        if (!smartphoneRepository.existsById(id)) {
            throw new ResourceNotFoundException("Smartphone not found with id: " + id);
        }
        smartphoneRepository.deleteById(id);
    }
}
