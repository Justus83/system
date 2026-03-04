package com.salesmatrix.service.impl;

import com.salesmatrix.dto.UserDTO;
import com.salesmatrix.entity.StoreAccess;
import com.salesmatrix.entity.User;
import com.salesmatrix.mapper.UserMapper;
import com.salesmatrix.repository.StoreAccessRepository;
import com.salesmatrix.repository.UserRepository;
import com.salesmatrix.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final StoreAccessRepository storeAccessRepository;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already used. Please try another email to sign in.");
        }
        
        // If no password is provided, use phone number as password
        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty() || userDTO.getPassword().isBlank()) {
            if (userDTO.getPhoneNumber() != null && !userDTO.getPhoneNumber().isEmpty() && !userDTO.getPhoneNumber().isBlank()) {
                userDTO.setPassword(userDTO.getPhoneNumber());
            } else {
                throw new RuntimeException("Either password or phone number is required");
            }
        }
        
        // Validate password length if provided
        if (userDTO.getPassword() != null && userDTO.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        
        User user = userMapper.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDTO)
                .toList();
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userMapper.updateEntity(user, userDTO);
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Soft delete: just mark as inactive instead of deleting
        // This preserves all historical data (sales, transactions, etc.)
        user.setIsActive(false);
        userRepository.save(user);
        
        // Optionally, you can also remove their store access
        List<StoreAccess> storeAccesses = storeAccessRepository.findByUserId(id);
        storeAccessRepository.deleteAll(storeAccesses);
    }

    @Override
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
