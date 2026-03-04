package com.salesmatrix.service.impl;

import com.salesmatrix.dto.BeerDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.Beer;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import com.salesmatrix.enums.SourceType;
import com.salesmatrix.exception.BusinessException;
import com.salesmatrix.exception.ResourceNotFoundException;
import com.salesmatrix.mapper.BeerMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.BeerRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.SupplierRepository;
import com.salesmatrix.service.BeerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BeerServiceImpl implements BeerService {

    private final BeerRepository beerRepository;
    private final StoreRepository storeRepository;
    private final SupplierRepository supplierRepository;
    private final BranchRepository branchRepository;
    private final BrandRepository brandRepository;
    private final BeerMapper beerMapper;

    @Override
    public BeerDTO createBeer(BeerDTO beerDTO) {
        Store store = storeRepository.findById(beerDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + beerDTO.getStoreId()));

        Branch branch = null;
        if (beerDTO.getBranchId() != null) {
            branch = branchRepository.findById(beerDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + beerDTO.getBranchId()));
        }

        // Check for duplicate beer
        List<Beer> existingBeers = beerRepository.findByBrandAndSizeAndPackagingAndStore(
            beerDTO.getBrand(), 
            beerDTO.getSize(), 
            beerDTO.getPackaging(),
            beerDTO.getStoreId()
        );
        
        if (!existingBeers.isEmpty()) {
            throw new BusinessException("A beer with this Brand, Size, and Packaging combination already exists in this store");
        }

        Beer beer = beerMapper.toEntity(beerDTO, store, branch);
        Beer savedBeer = beerRepository.save(beer);
        return beerMapper.toDTO(savedBeer);
    }

    @Override
    @Transactional(readOnly = true)
    public BeerDTO getBeerById(Long id) {
        Beer beer = beerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beer not found with id: " + id));
        return beerMapper.toDTO(beer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerDTO> getAllBeers() {
        return beerRepository.findAll()
                .stream()
                .map(beerMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerDTO> getBeersByStoreId(Long storeId) {
        return beerRepository.findByStoreId(storeId)
                .stream()
                .map(beerMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeerDTO> getBeersByBrand(String brand) {
        BrandEntity brandEntity = brandRepository.findByName(brand)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found: " + brand));
        return beerRepository.findByBrand(brandEntity)
                .stream()
                .map(beerMapper::toDTO)
                .toList();
    }

    @Override
    public BeerDTO updateBeer(Long id, BeerDTO beerDTO) {
        Beer beer = beerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Beer not found with id: " + id));

        Store store = storeRepository.findById(beerDTO.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + beerDTO.getStoreId()));

        Branch branch = null;
        if (beerDTO.getBranchId() != null) {
            branch = branchRepository.findById(beerDTO.getBranchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + beerDTO.getBranchId()));
        }

        // Check for duplicate beer (excluding current beer)
        List<Beer> existingBeers = beerRepository.findByBrandAndSizeAndPackagingAndStore(
            beerDTO.getBrand(), 
            beerDTO.getSize(), 
            beerDTO.getPackaging(),
            beerDTO.getStoreId()
        );
        
        if (!existingBeers.isEmpty() && !existingBeers.get(0).getId().equals(id)) {
            throw new BusinessException("A beer with this Brand, Size, and Packaging combination already exists in this store");
        }

        beerMapper.updateEntity(beer, beerDTO, store, branch);
        Beer updatedBeer = beerRepository.save(beer);
        return beerMapper.toDTO(updatedBeer);
    }

    @Override
    public void deleteBeer(Long id) {
        if (!beerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Beer not found with id: " + id);
        }
        beerRepository.deleteById(id);
    }
}
