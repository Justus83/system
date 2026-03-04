package com.salesmatrix.service.impl;

import com.salesmatrix.dto.TVDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.TV;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.TVMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.TVRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.TVService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TVServiceImpl implements TVService {

    private final TVRepository tvRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final TVMapper tvMapper;

    @Override
    public TVDTO createTV(TVDTO tvDTO) {
        Store store = storeRepository.findById(tvDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + tvDTO.getStoreId()));

        Supplier supplier = null;
        if (tvDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(tvDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + tvDTO.getSupplierId()));
        }

        Branch branch = null;
        if (tvDTO.getBranchId() != null) {
            branch = branchRepository.findById(tvDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + tvDTO.getBranchId()));
        }

        if (tvRepository.existsBySerialNumber(tvDTO.getSerialNumber())) {
            throw new BusinessException("TV with serial number " + tvDTO.getSerialNumber() + " already exists");
        }

        TV tv = tvMapper.toEntity(tvDTO, store, supplier, branch);
        TV savedTV = tvRepository.save(tv);
        return tvMapper.toDTO(savedTV);
    }

    @Override
    @Transactional(readOnly = true)
    public TVDTO getTVById(Long id) {
        TV tv = tvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TV not found with id: " + id));
        return tvMapper.toDTO(tv);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TVDTO> getAllTVs() {
        return tvRepository.findAll()
                .stream()
                .map(tvMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TVDTO> getTVsByStoreId(Long storeId) {
        return tvRepository.findByStoreId(storeId)
                .stream()
                .map(tvMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TVDTO> getTVsByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return tvRepository.findByBrand(brandEntity)
                .stream()
                .map(tvMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TVDTO getTVBySerialNumber(String serialNumber) {
        TV tv = tvRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("TV not found with serial number: " + serialNumber));
        return tvMapper.toDTO(tv);
    }

    @Override
    public TVDTO updateTV(Long id, TVDTO tvDTO) {
        TV tv = tvRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TV not found with id: " + id));

        Store store = storeRepository.findById(tvDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + tvDTO.getStoreId()));

        Supplier supplier = null;
        if (tvDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(tvDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + tvDTO.getSupplierId()));
        }

        Branch branch = null;
        if (tvDTO.getBranchId() != null) {
            branch = branchRepository.findById(tvDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + tvDTO.getBranchId()));
        }

        if (!tv.getSerialNumber().equals(tvDTO.getSerialNumber()) &&
                tvRepository.existsBySerialNumber(tvDTO.getSerialNumber())) {
            throw new BusinessException("TV with serial number " + tvDTO.getSerialNumber() + " already exists");
        }

        tvMapper.updateEntity(tv, tvDTO, store, supplier, branch);
        TV updatedTV = tvRepository.save(tv);
        return tvMapper.toDTO(updatedTV);
    }

    @Override
    public void deleteTV(Long id) {
        if (!tvRepository.existsById(id)) {
            throw new ResourceNotFoundException("TV not found with id: " + id);
        }
        tvRepository.deleteById(id);
    }
}
