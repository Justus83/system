package com.salesmatrix.service;

import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserContextService {

    private final UserRepository userRepository;
    private final StoreAccessRepository storeAccessRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof UserDetails)) {
            throw new RuntimeException("Invalid authentication principal");
        }

        String email = ((UserDetails) principal).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public Long getCurrentUserStoreId() {
        User user = getCurrentUser();
        List<StoreAccess> storeAccessList = storeAccessRepository.findByUserId(user.getId());
        
        if (storeAccessList.isEmpty()) {
            throw new RuntimeException("No store associated with your account. Please create a store first in Settings.");
        }
        
        return storeAccessList.get(0).getStore().getId();
    }

    public Long getCurrentUserBranchId() {
        User user = getCurrentUser();
        List<StoreAccess> storeAccessList = storeAccessRepository.findByUserId(user.getId());
        
        if (storeAccessList.isEmpty()) {
            return null;
        }
        
        StoreAccess storeAccess = storeAccessList.get(0);
        return storeAccess.getBranch() != null ? storeAccess.getBranch().getId() : null;
    }
}
