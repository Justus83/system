package com.salesmatrix.mapper;

import com.salesmatrix.dto.CustomerDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerDTO dto, Store store, Branch branch) {
        return Customer.builder()
                .name(dto.getName())
                .phoneNumber(dto.getPhoneNumber())
                .store(store)
                .branch(branch)
                .build();
    }

    public CustomerDTO toDTO(Customer customer) {
        return CustomerDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .phoneNumber(customer.getPhoneNumber())
                .storeId(customer.getStore() != null ? customer.getStore().getId() : null)
                .storeName(customer.getStore() != null ? customer.getStore().getName() : null)
                .branchId(customer.getBranch() != null ? customer.getBranch().getId() : null)
                .branchAddress(customer.getBranch() != null ? customer.getBranch().getAddress() : null)
                .build();
    }

    public void updateEntity(Customer customer, CustomerDTO dto, Store store, Branch branch) {
        customer.setName(dto.getName());
        customer.setPhoneNumber(dto.getPhoneNumber());
        customer.setStore(store);
        customer.setBranch(branch);
    }
}
