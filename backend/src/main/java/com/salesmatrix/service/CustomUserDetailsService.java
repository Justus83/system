package com.salesmatrix.service;

import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StoreAccessRepository storeAccessRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Load user's roles from StoreAccess
        List<StoreAccess> storeAccesses = storeAccessRepository.findByUserId(user.getId());

        // Convert roles to GrantedAuthority
        List<GrantedAuthority> authorities = storeAccesses.stream()
                .map(sa -> new SimpleGrantedAuthority("ROLE_" + sa.getRole().name()))
                .distinct()
                .collect(Collectors.toList());

        // Return User with authorities loaded from StoreAccess
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getIsActive() != null ? user.getIsActive() : true,
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                authorities
        );
    }
}
