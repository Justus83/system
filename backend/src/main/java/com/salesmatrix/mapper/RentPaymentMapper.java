package com.salesmatrix.mapper;

import com.salesmatrix.dto.RentPaymentDTO;
import com.salesmatrix.entity.RentPayment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Tenant;
import org.springframework.stereotype.Component;

@Component
public class RentPaymentMapper {

    public RentPayment toEntity(RentPaymentDTO dto, Tenant tenant, Store store) {
        return RentPayment.builder()
                .tenant(tenant)
                .amountPaid(dto.getAmountPaid())
                .rentPayable(dto.getRentPayable())
                .balance(dto.getBalance())
                .paymentDate(dto.getPaymentDate())
                .nextPaymentDate(dto.getNextPaymentDate())
                .paymentStatus(dto.getPaymentStatus())
                .paymentMethod(dto.getPaymentMethod())
                .remarks(dto.getRemarks())
                .store(store)
                .build();
    }

    public RentPaymentDTO toDTO(RentPayment rentPayment) {
        return RentPaymentDTO.builder()
                .id(rentPayment.getId())
                .tenantId(rentPayment.getTenant() != null ? rentPayment.getTenant().getId() : null)
                .tenantName(rentPayment.getTenant() != null ? rentPayment.getTenant().getName() : null)
                .amountPaid(rentPayment.getAmountPaid())
                .rentPayable(rentPayment.getRentPayable())
                .balance(rentPayment.getBalance())
                .paymentDate(rentPayment.getPaymentDate())
                .nextPaymentDate(rentPayment.getNextPaymentDate())
                .paymentStatus(rentPayment.getPaymentStatus())
                .paymentMethod(rentPayment.getPaymentMethod())
                .remarks(rentPayment.getRemarks())
                .storeId(rentPayment.getStore() != null ? rentPayment.getStore().getId() : null)
                .storeName(rentPayment.getStore() != null ? rentPayment.getStore().getName() : null)
                .build();
    }

    public void updateEntity(RentPayment rentPayment, RentPaymentDTO dto, Tenant tenant, Store store) {
        rentPayment.setTenant(tenant);
        rentPayment.setAmountPaid(dto.getAmountPaid());
        rentPayment.setRentPayable(dto.getRentPayable());
        rentPayment.setBalance(dto.getBalance());
        rentPayment.setPaymentDate(dto.getPaymentDate());
        rentPayment.setNextPaymentDate(dto.getNextPaymentDate());
        rentPayment.setPaymentStatus(dto.getPaymentStatus());
        rentPayment.setPaymentMethod(dto.getPaymentMethod());
        rentPayment.setRemarks(dto.getRemarks());
        rentPayment.setStore(store);
    }
}
