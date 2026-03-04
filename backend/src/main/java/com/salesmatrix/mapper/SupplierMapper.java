package com.salesmatrix.mapper;

import com.salesmatrix.dto.SupplierDTO;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Supplier;
import org.springframework.stereotype.Component;

@Component
public class SupplierMapper {

    public Supplier toEntity(SupplierDTO dto, Store store) {
        return Supplier.builder()
                .name(dto.getName())
                .contactPerson(dto.getContactPerson())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .store(store)
                .build();
    }

    public SupplierDTO toDTO(Supplier supplier) {
        return SupplierDTO.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactPerson(supplier.getContactPerson())
                .phoneNumber(supplier.getPhoneNumber())
                .email(supplier.getEmail())
                .address(supplier.getAddress())
                .storeId(supplier.getStore() != null ? supplier.getStore().getId() : null)
                .storeName(supplier.getStore() != null ? supplier.getStore().getName() : null)
                .build();
    }

    public void updateEntity(Supplier supplier, SupplierDTO dto, Store store) {
        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setPhoneNumber(dto.getPhoneNumber());
        supplier.setEmail(dto.getEmail());
        supplier.setAddress(dto.getAddress());
        supplier.setStore(store);
    }
}