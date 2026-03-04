package com.salesmatrix.mapper;

import com.salesmatrix.dto.UserDTO;
import com.salesmatrix.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserDTO dto) {
        return User.builder()
                .id(dto.getId())
                .name(dto.getName())
                .password(dto.getPassword())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .hireDate(dto.getHireDate())
                .salary(dto.getSalary())
                .position(dto.getPosition())
                .address(dto.getAddress())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
    }

    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .password(user.getPassword())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .hireDate(user.getHireDate())
                .salary(user.getSalary())
                .position(user.getPosition())
                .address(user.getAddress())
                .isActive(user.getIsActive())
                .build();
    }

    public void updateEntity(User user, UserDTO dto) {
        user.setName(dto.getName());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        
        if (dto.getHireDate() != null) {
            user.setHireDate(dto.getHireDate());
        }
        if (dto.getSalary() != null) {
            user.setSalary(dto.getSalary());
        }
        if (dto.getPosition() != null) {
            user.setPosition(dto.getPosition());
        }
        if (dto.getAddress() != null) {
            user.setAddress(dto.getAddress());
        }
        if (dto.getIsActive() != null) {
            user.setIsActive(dto.getIsActive());
        }
    }
}
