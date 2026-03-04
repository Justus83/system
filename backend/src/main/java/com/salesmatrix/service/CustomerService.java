package com.salesmatrix.service;

import com.salesmatrix.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {

    CustomerDTO createCustomer(CustomerDTO customerDTO);

    CustomerDTO getCustomerById(Long id);

    List<CustomerDTO> getAllCustomers();

    List<CustomerDTO> getCustomersByStoreId(Long storeId);

    List<CustomerDTO> getCustomersByBranchId(Long branchId);

    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);

    void deleteCustomer(Long id);
}