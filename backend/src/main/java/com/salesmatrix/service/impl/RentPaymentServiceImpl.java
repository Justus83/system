package com.salesmatrix.service.impl;

import com.salesmatrix.dto.RentPaymentDTO;
import com.salesmatrix.entity.RentPayment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Tenant;
import com.salesmatrix.mapper.RentPaymentMapper;
import com.salesmatrix.repository.RentPaymentRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.TenantRepository;
import com.salesmatrix.service.RentPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RentPaymentServiceImpl implements RentPaymentService {

    private final RentPaymentRepository rentPaymentRepository;
    private final TenantRepository tenantRepository;
    private final StoreRepository storeRepository;
    private final RentPaymentMapper rentPaymentMapper;

    @Override
    public RentPaymentDTO createRentPayment(RentPaymentDTO rentPaymentDTO) {
        Store store = storeRepository.findById(rentPaymentDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Tenant tenant = tenantRepository.findById(rentPaymentDTO.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        RentPayment rentPayment = rentPaymentMapper.toEntity(rentPaymentDTO, tenant, store);
        return rentPaymentMapper.toDTO(rentPaymentRepository.save(rentPayment));
    }

    @Override
    @Transactional(readOnly = true)
    public RentPaymentDTO getRentPaymentById(Long id) {
        return rentPaymentRepository.findById(id)
                .map(rentPaymentMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Rent payment not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentPaymentDTO> getAllRentPayments() {
        return rentPaymentRepository.findAll().stream()
                .map(rentPaymentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentPaymentDTO> getRentPaymentsByStoreId(Long storeId) {
        return rentPaymentRepository.findByStoreId(storeId).stream()
                .map(rentPaymentMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RentPaymentDTO> getRentPaymentsByTenantId(Long tenantId) {
        return rentPaymentRepository.findByTenantIdOrderByPaymentDateDesc(tenantId).stream()
                .map(rentPaymentMapper::toDTO)
                .toList();
    }

    @Override
    public RentPaymentDTO updateRentPayment(Long id, RentPaymentDTO rentPaymentDTO) {
        RentPayment rentPayment = rentPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rent payment not found"));
        Store store = storeRepository.findById(rentPaymentDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found"));
        Tenant tenant = tenantRepository.findById(rentPaymentDTO.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        rentPaymentMapper.updateEntity(rentPayment, rentPaymentDTO, tenant, store);
        return rentPaymentMapper.toDTO(rentPaymentRepository.save(rentPayment));
    }

    @Override
    public void deleteRentPayment(Long id) {
        if (!rentPaymentRepository.existsById(id)) {
            throw new RuntimeException("Rent payment not found");
        }
        rentPaymentRepository.deleteById(id);
    }

    @Override
    public RentPaymentDTO signPayment(Long id, String signedBy) {
        RentPayment rentPayment = rentPaymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rent payment not found"));
        
        rentPayment.setSignedBy(signedBy);
        rentPayment.setSignedAt(java.time.LocalDateTime.now());
        
        return rentPaymentMapper.toDTO(rentPaymentRepository.save(rentPayment));
    }
}
