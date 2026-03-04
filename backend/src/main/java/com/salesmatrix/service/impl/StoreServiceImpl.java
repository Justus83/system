package com.salesmatrix.service.impl;

import com.salesmatrix.dto.StoreDTO;
import com.salesmatrix.entity.Shop;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import com.salesmatrix.enums.Role;
import com.salesmatrix.enums.ShopType;
import com.salesmatrix.mapper.StoreMapper;
import com.salesmatrix.repository.ShopRepository;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.UserRepository;
import com.salesmatrix.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final ShopRepository shopRepository;
    private final StoreMapper storeMapper;
    private final StoreAccessRepository storeAccessRepository;
    private final UserRepository userRepository;

    @Override
    public StoreDTO createStore(StoreDTO storeDTO) {
        Shop shop = resolveShop(storeDTO);
        Store store = storeMapper.toEntity(storeDTO, shop);
        Store savedStore = storeRepository.save(store);
        
        // Automatically assign the creator as OWNER
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getName() != null) {
            User currentUser = userRepository.findByEmail(authentication.getName())
                    .orElse(null);
            if (currentUser != null) {
                StoreAccess storeAccess = StoreAccess.builder()
                        .user(currentUser)
                        .store(savedStore)
                        .role(Role.OWNER)
                        .build();
                storeAccessRepository.save(storeAccess);
            }
        }
        
        return storeMapper.toDTO(savedStore);
    }
    
    /**
     * Resolves the Shop entity based on either shopId or shopType from the DTO.
     * Priority: shopId > shopType
     * If shopType is provided, it will look up an existing Shop with that type.
     */
    private Shop resolveShop(StoreDTO storeDTO) {
        // If shopId is provided, use it directly
        if (storeDTO.getShopId() != null) {
            return shopRepository.findById(storeDTO.getShopId())
                    .orElseThrow(() -> new RuntimeException("Shop not found with id: " + storeDTO.getShopId()));
        }
        
        // If shopType is provided, look up the existing Shop with that type
        if (storeDTO.getShopType() != null) {
            return shopRepository.findByShopType(storeDTO.getShopType())
                    .orElseThrow(() -> new RuntimeException("Shop category not found with type: " + storeDTO.getShopType() + 
                            ". Please ensure the shop category exists in the system."));
        }
        
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public StoreDTO getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        return storeMapper.toDTO(store);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll()
                .stream()
                .map(storeMapper::toDTO)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<StoreDTO> getStoresByCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of();
        }
        
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElse(null);
        
        if (currentUser == null) {
            return List.of();
        }
        
        // Get all stores the user has access to via StoreAccess
        List<StoreAccess> storeAccessList = storeAccessRepository.findByUserIdWithStore(currentUser.getId());
        
        return storeAccessList.stream()
                .map(StoreAccess::getStore)
                .distinct()
                .map(storeMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreDTO> getStoresByShopId(Long shopId) {
        return storeRepository.findByShopId(shopId)
                .stream()
                .map(storeMapper::toDTO)
                .toList();
    }

    @Override
    public StoreDTO updateStore(Long id, StoreDTO storeDTO) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        Shop shop = resolveShop(storeDTO);
        storeMapper.updateEntity(store, storeDTO, shop);
        Store updatedStore = storeRepository.save(store);
        return storeMapper.toDTO(updatedStore);
    }

    @Override
    public void deleteStore(Long id) {
        if (!storeRepository.existsById(id)) {
            throw new RuntimeException("Store not found with id: " + id);
        }
        storeRepository.deleteById(id);
    }
}
