package com.salesmatrix.controller;

import com.salesmatrix.dto.AuthResponseDTO;
import com.salesmatrix.dto.LoginRequestDTO;
import com.salesmatrix.dto.UserDTO;
import com.salesmatrix.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signup(@Valid @RequestBody UserDTO userDTO) {
        AuthResponseDTO response = authService.signup(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody UserDTO userDTO) {
        AuthResponseDTO response = authService.signup(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        AuthResponseDTO response = authService.login(loginRequestDTO);
        return ResponseEntity.ok(response);
    }
}