package com.salesmatrix.service;

import com.salesmatrix.dto.UserDTO;

import java.util.List;

public interface UserService {

    UserDTO createUser(UserDTO userDTO);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);
    
    void changePassword(Long userId, String currentPassword, String newPassword);
}
