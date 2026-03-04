package com.salesmatrix.service;

import com.salesmatrix.dto.AuthResponseDTO;
import com.salesmatrix.dto.LoginRequestDTO;
import com.salesmatrix.dto.UserDTO;
import com.salesmatrix.entity.Subscription;
import com.salesmatrix.enums.SubscriptionPlan;
import com.salesmatrix.entity.User;
import com.salesmatrix.mapper.UserMapper;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.SubscriptionRepository;
import com.salesmatrix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final SubscriptionRepository subscriptionRepository;
    private final StoreAccessRepository storeAccessRepository;

    @Transactional
    public AuthResponseDTO signup(UserDTO userDTO) {
        // Check if email already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already used. Please try another email to sign in.");
        }
        
        User user = userMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        
        // Create default STARTER subscription for new users
        Subscription defaultSubscription = Subscription.builder()
                .owner(savedUser)
                .plan(SubscriptionPlan.STARTER)
                .startDate(LocalDateTime.now())
                .active(true)
                .build();
        subscriptionRepository.save(defaultSubscription);
        
        // Don't generate token on signup - user should login after registration
        return AuthResponseDTO.builder()
                .user(userMapper.toDTO(savedUser))
                .hasStoreAccess(false)
                .build();
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + loginRequestDTO.getEmail()));

        String token = jwtService.generateToken(user);
        
        // Check if user has any store access and get the first store/branch
        var storeAccessList = storeAccessRepository.findByUserId(user.getId());
        boolean hasStoreAccess = !storeAccessList.isEmpty();
        Long storeId = hasStoreAccess ? storeAccessList.get(0).getStore().getId() : null;
        Long branchId = hasStoreAccess && storeAccessList.get(0).getBranch() != null 
            ? storeAccessList.get(0).getBranch().getId() : null;
        String shopType = hasStoreAccess && storeAccessList.get(0).getStore().getShop() != null
            ? storeAccessList.get(0).getStore().getShop().getShopType().name() : null;

        return AuthResponseDTO.builder()
                .token(token)
                .user(userMapper.toDTO(user))
                .hasStoreAccess(hasStoreAccess)
                .storeId(storeId)
                .branchId(branchId)
                .shopType(shopType)
                .build();
    }
}