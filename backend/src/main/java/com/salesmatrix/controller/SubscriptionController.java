package com.salesmatrix.controller;

import com.salesmatrix.dto.SubscriptionDTO;
import com.salesmatrix.enums.SubscriptionPlan;
import com.salesmatrix.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionDTO> createSubscription(@Valid @RequestBody SubscriptionDTO dto) {
        SubscriptionDTO response = subscriptionService.createSubscription(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable Long id) {
        SubscriptionDTO response = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionByUserId(@PathVariable Long userId) {
        SubscriptionDTO response = subscriptionService.getSubscriptionByUserId(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionDTO>> getAllSubscriptions() {
        List<SubscriptionDTO> responses = subscriptionService.getAllSubscriptions();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionDTO dto) {
        SubscriptionDTO response = subscriptionService.updateSubscription(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/upgrade")
    public ResponseEntity<SubscriptionDTO> upgradePlan(
            @PathVariable Long id,
            @RequestParam SubscriptionPlan newPlan) {
        SubscriptionDTO response = subscriptionService.upgradePlan(id, newPlan);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<SubscriptionDTO> deactivateSubscription(@PathVariable Long id) {
        SubscriptionDTO response = subscriptionService.deactivateSubscription(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<SubscriptionDTO> activateSubscription(@PathVariable Long id) {
        SubscriptionDTO response = subscriptionService.activateSubscription(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/can-create-store")
    public ResponseEntity<Boolean> canCreateStore(@PathVariable Long userId) {
        boolean canCreate = subscriptionService.canCreateStore(userId);
        return ResponseEntity.ok(canCreate);
    }

    @GetMapping("/user/{userId}/can-create-branch")
    public ResponseEntity<Boolean> canCreateBranch(
            @PathVariable Long userId,
            @RequestParam Long storeId) {
        boolean canCreate = subscriptionService.canCreateBranch(userId, storeId);
        return ResponseEntity.ok(canCreate);
    }

    @GetMapping("/user/{userId}/can-add-user")
    public ResponseEntity<Boolean> canAddUser(@PathVariable Long userId) {
        boolean canAdd = subscriptionService.canAddUser(userId);
        return ResponseEntity.ok(canAdd);
    }
}
