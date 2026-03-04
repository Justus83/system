package com.salesmatrix.service.impl;

import com.salesmatrix.dto.TabletDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Tablet;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.TabletMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.TabletRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.TabletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TabletServiceImpl implements TabletService {

    private final TabletRepository tabletRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final TabletMapper tabletMapper;

    @Override
    public TabletDTO createTablet(TabletDTO tabletDTO) {
        Store store = storeRepository.findById(tabletDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + tabletDTO.getStoreId()));

        Supplier supplier = null;
        if (tabletDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(tabletDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + tabletDTO.getSupplierId()));
        }

        Branch branch = null;
        if (tabletDTO.getBranchId() != null) {
            branch = branchRepository.findById(tabletDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + tabletDTO.getBranchId()));
        }

        if (tabletRepository.existsBySerialNumber(tabletDTO.getSerialNumber())) {
            throw new BusinessException("Tablet with serial number " + tabletDTO.getSerialNumber() + " already exists");
        }

        Tablet tablet = tabletMapper.toEntity(tabletDTO, store, supplier, branch);
        Tablet savedTablet = tabletRepository.save(tablet);
        return tabletMapper.toDTO(savedTablet);
    }

    @Override
    @Transactional(readOnly = true)
    public TabletDTO getTabletById(Long id) {
        Tablet tablet = tabletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tablet not found with id: " + id));
        return tabletMapper.toDTO(tablet);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TabletDTO> getAllTablets() {
        return tabletRepository.findAll()
                .stream()
                .map(tabletMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TabletDTO> getTabletsByStoreId(Long storeId) {
        return tabletRepository.findByStoreId(storeId)
                .stream()
                .map(tabletMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TabletDTO> getTabletsByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return tabletRepository.findByBrand(brandEntity)
                .stream()
                .map(tabletMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TabletDTO getTabletBySerialNumber(String serialNumber) {
        Tablet tablet = tabletRepository.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Tablet not found with serial number: " + serialNumber));
        return tabletMapper.toDTO(tablet);
    }

    @Override
    public TabletDTO updateTablet(Long id, TabletDTO tabletDTO) {
        Tablet tablet = tabletRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tablet not found with id: " + id));

        Store store = storeRepository.findById(tabletDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + tabletDTO.getStoreId()));

        Supplier supplier = null;
        if (tabletDTO.getSupplierId() != null) {
            supplier = supplierRepository.findById(tabletDTO.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + tabletDTO.getSupplierId()));
        }

        Branch branch = null;
        if (tabletDTO.getBranchId() != null) {
            branch = branchRepository.findById(tabletDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + tabletDTO.getBranchId()));
        }

        if (!tablet.getSerialNumber().equals(tabletDTO.getSerialNumber()) &&
                tabletRepository.existsBySerialNumber(tabletDTO.getSerialNumber())) {
            throw new BusinessException("Tablet with serial number " + tabletDTO.getSerialNumber() + " already exists");
        }

        tabletMapper.updateEntity(tablet, tabletDTO, store, supplier, branch);
        Tablet updatedTablet = tabletRepository.save(tablet);
        return tabletMapper.toDTO(updatedTablet);
    }

    @Override
    public void deleteTablet(Long id) {
        if (!tabletRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tablet not found with id: " + id);
        }
        tabletRepository.deleteById(id);
    }
}
