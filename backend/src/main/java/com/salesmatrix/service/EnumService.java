package com.salesmatrix.service;

import com.salesmatrix.entity.BrandEntity;
import com.salesmatrix.entity.ColorEntity;
import com.salesmatrix.entity.ModelEntity;
import com.salesmatrix.entity.RamSizeEntity;
import com.salesmatrix.entity.ResolutionEntity;
import com.salesmatrix.entity.ScreenSizeEntity;
import com.salesmatrix.entity.StorageSizeEntity;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.TVTypeEntity;
import com.salesmatrix.repository.BrandRepository;
import com.salesmatrix.repository.ColorRepository;
import com.salesmatrix.repository.ModelRepository;
import com.salesmatrix.repository.RamSizeRepository;
import com.salesmatrix.repository.ResolutionRepository;
import com.salesmatrix.repository.ScreenSizeRepository;
import com.salesmatrix.repository.StorageSizeRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.TVTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EnumService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private RamSizeRepository ramSizeRepository;

    @Autowired
    private StorageSizeRepository storageSizeRepository;

    @Autowired
    private ModelRepository modelRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private ScreenSizeRepository screenSizeRepository;

    @Autowired
    private ResolutionRepository resolutionRepository;

    @Autowired
    private TVTypeRepository tvTypeRepository;

    @Autowired
    private StoreRepository storeRepository;

    // Brand methods
    public List<Map<String, Object>> getAllBrands(Long storeId) {
        return brandRepository.findByStoreId(storeId).stream()
                .map(brand -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", brand.getId());
                    map.put("name", brand.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createBrand(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Brand name cannot be null or empty");
        }
        
        if (brandRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Brand '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        BrandEntity brand = BrandEntity.builder()
                .name(name)
                .store(store)
                .build();
        brand = brandRepository.save(brand);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", brand.getId());
        result.put("name", brand.getName());
        return result;
    }

    // RAM Size methods
    public List<Map<String, Object>> getAllRamSizes(Long storeId) {
        return ramSizeRepository.findByStoreId(storeId).stream()
                .map(ram -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", ram.getId());
                    map.put("name", ram.getName());
                    map.put("displayName", ram.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createRamSize(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("RAM Size name cannot be null or empty");
        }
        
        if (ramSizeRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("RAM Size '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        RamSizeEntity ram = new RamSizeEntity();
        ram.setName(name);
        ram.setStore(store);
        ram = ramSizeRepository.save(ram);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", ram.getId());
        result.put("name", ram.getName());
        return result;
    }

    // Storage Size methods
    public List<Map<String, Object>> getAllStorageSizes(Long storeId) {
        return storageSizeRepository.findByStoreId(storeId).stream()
                .map(storage -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", storage.getId());
                    map.put("name", storage.getName());
                    map.put("displayName", storage.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createStorageSize(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Storage Size name cannot be null or empty");
        }
        
        if (storageSizeRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Storage Size '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        StorageSizeEntity storage = new StorageSizeEntity();
        storage.setName(name);
        storage.setStore(store);
        storage = storageSizeRepository.save(storage);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", storage.getId());
        result.put("name", storage.getName());
        return result;
    }

    // Model methods
    public List<Map<String, Object>> getAllModels(Long storeId) {
        return modelRepository.findByStoreId(storeId).stream()
                .map(model -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", model.getId());
                    map.put("name", model.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createModel(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Model name cannot be null or empty");
        }
        
        if (modelRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Model '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        ModelEntity model = ModelEntity.builder()
                .name(name)
                .store(store)
                .build();
        model = modelRepository.save(model);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", model.getId());
        result.put("name", model.getName());
        return result;
    }

    // Color methods
    public List<Map<String, Object>> getAllColors(Long storeId) {
        return colorRepository.findByStoreId(storeId).stream()
                .map(color -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", color.getId());
                    map.put("name", color.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createColor(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Color name cannot be null or empty");
        }
        
        if (colorRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Color '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        ColorEntity color = new ColorEntity();
        color.setName(name);
        color.setStore(store);
        color = colorRepository.save(color);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", color.getId());
        result.put("name", color.getName());
        return result;
    }

    // Screen Size methods
    public List<Map<String, Object>> getAllScreenSizes(Long storeId) {
        return screenSizeRepository.findByStoreId(storeId).stream()
                .map(size -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", size.getId());
                    map.put("name", size.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createScreenSize(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Screen Size name cannot be null or empty");
        }
        
        if (screenSizeRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Screen Size '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        ScreenSizeEntity screenSize = new ScreenSizeEntity();
        screenSize.setName(name);
        screenSize.setStore(store);
        screenSize = screenSizeRepository.save(screenSize);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", screenSize.getId());
        result.put("name", screenSize.getName());
        return result;
    }

    // Resolution methods
    public List<Map<String, Object>> getAllResolutions(Long storeId) {
        return resolutionRepository.findByStoreId(storeId).stream()
                .map(resolution -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", resolution.getId());
                    map.put("name", resolution.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createResolution(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Resolution name cannot be null or empty");
        }
        
        if (resolutionRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("Resolution '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        ResolutionEntity resolution = new ResolutionEntity();
        resolution.setName(name);
        resolution.setStore(store);
        resolution = resolutionRepository.save(resolution);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", resolution.getId());
        result.put("name", resolution.getName());
        return result;
    }

    // TV Type methods
    public List<Map<String, Object>> getAllTVTypes(Long storeId) {
        return tvTypeRepository.findByStoreId(storeId).stream()
                .map(type -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", type.getId());
                    map.put("name", type.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public Map<String, Object> createTVType(String name, Long storeId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("TV Type name cannot be null or empty");
        }
        
        if (tvTypeRepository.existsByNameAndStoreId(name, storeId)) {
            throw new RuntimeException("TV Type '" + name + "' already exists in this store");
        }
        
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        
        TVTypeEntity tvType = new TVTypeEntity();
        tvType.setName(name);
        tvType.setStore(store);
        tvType = tvTypeRepository.save(tvType);
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("id", tvType.getId());
        result.put("name", tvType.getName());
        return result;
    }

}
