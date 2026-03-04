package com.salesmatrix.service.impl;

import com.salesmatrix.dto.LaptopDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Laptop;
import com.salesmatrix.entity.Store;


import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.LaptopMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.LaptopRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.LaptopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LaptopServiceImpl implements LaptopService {

    private final LaptopRepository laptopRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final LaptopMapper laptopMapper;

    @Override
    public LaptopDTO createLaptop(LaptopDTO laptopDTO) {
        Store store = storeRepository.findById(laptopDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + laptopDTO.getStoreId()));

        Supplier supplier = null;
        if (laptopDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(laptopDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + laptopDTO.getSupplierId()));
        }

        Branch branch = null;
        if (laptopDTO.getBranchId() != null) {
            branch = branchRepository.findById(laptopDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + laptopDTO.getBranchId()));
        }

        if (laptopRepository.existsBySerialNumber(laptopDTO.getSerialNumber())) {
            throw new BusinessException("Laptop with serial number " + laptopDTO.getSerialNumber() + " already exists");
        }

        Laptop laptop = laptopMapper.toEntity(laptopDTO, store, supplier, branch);
        Laptop savedLaptop = laptopRepository.save(laptop);
        return laptopMapper.toDTO(savedLaptop);
    }

    @Override
    @Transactional(readOnly = true)
    public LaptopDTO getLaptopById(Long id) {
        Laptop laptop = laptopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found with id: " + id));
        return laptopMapper.toDTO(laptop);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LaptopDTO> getAllLaptops() {
        return laptopRepository.findAll()
                .stream()
                .map(laptopMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LaptopDTO> getLaptopsByStoreId(Long storeId) {
        return laptopRepository.findByStoreId(storeId)
                .stream()
                .map(laptopMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<LaptopDTO> getLaptopsByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return laptopRepository.findByBrand(brandEntity)
                .stream()
                .map(laptopMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public LaptopDTO getLaptopBySerialNumber(String serialNumber) {
        Laptop laptop = laptopRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found with serial number: " + serialNumber));
        return laptopMapper.toDTO(laptop);
    }

    @Override
    public LaptopDTO updateLaptop(Long id, LaptopDTO laptopDTO) {
        Laptop laptop = laptopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Laptop not found with id: " + id));

        Store store = storeRepository.findById(laptopDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + laptopDTO.getStoreId()));

        Supplier supplier = null;
        if (laptopDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(laptopDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + laptopDTO.getSupplierId()));
        }

        Branch branch = null;
        if (laptopDTO.getBranchId() != null) {
            branch = branchRepository.findById(laptopDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + laptopDTO.getBranchId()));
        }

        if (!laptop.getSerialNumber().equals(laptopDTO.getSerialNumber()) &&
                laptopRepository.existsBySerialNumber(laptopDTO.getSerialNumber())) {
            throw new BusinessException("Laptop with serial number " + laptopDTO.getSerialNumber() + " already exists");
        }

        laptopMapper.updateEntity(laptop, laptopDTO, store, supplier, branch);
        Laptop updatedLaptop = laptopRepository.save(laptop);
        return laptopMapper.toDTO(updatedLaptop);
    }

    @Override
    public void deleteLaptop(Long id) {
        if (!laptopRepository.existsById(id)) {
            throw new ResourceNotFoundException("Laptop not found with id: " + id);
        }
        laptopRepository.deleteById(id);
    }
}
