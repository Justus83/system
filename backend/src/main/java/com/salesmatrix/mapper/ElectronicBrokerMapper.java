package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicBrokerDTO;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.ElectronicBroker;
import org.springframework.stereotype.Component;

@Component
public class ElectronicBrokerMapper {

    public ElectronicBroker toEntity(ElectronicBrokerDTO dto, Store store) {
        return ElectronicBroker.builder()
                .name(dto.getName())
                .phoneNumber(dto.getPhoneNumber())
                .shopName(dto.getShopName())
                .address(dto.getAddress())
                .store(store)
                .build();
    }

    public ElectronicBrokerDTO toDTO(ElectronicBroker electronicBroker) {
        return ElectronicBrokerDTO.builder()
                .id(electronicBroker.getId())
                .name(electronicBroker.getName())
                .phoneNumber(electronicBroker.getPhoneNumber())
                .shopName(electronicBroker.getShopName())
                .address(electronicBroker.getAddress())
                .storeId(electronicBroker.getStore() != null ? electronicBroker.getStore().getId() : null)
                .storeName(electronicBroker.getStore() != null ? electronicBroker.getStore().getName() : null)
                .build();
    }

    public void updateEntity(ElectronicBroker electronicBroker, ElectronicBrokerDTO dto, Store store) {
        electronicBroker.setName(dto.getName());
        electronicBroker.setPhoneNumber(dto.getPhoneNumber());
        electronicBroker.setShopName(dto.getShopName());
        electronicBroker.setAddress(dto.getAddress());
        electronicBroker.setStore(store);
    }
}