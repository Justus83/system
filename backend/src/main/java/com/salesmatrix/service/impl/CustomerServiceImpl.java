package com.salesmatrix.service.impl;

import com.salesmatrix.dto.CustomerDTO;
import com.salesmatrix.entity.Branch;
import com.salesmatrix.entity.Store;
import com.salesmatrix.entity.Customer;
import com.salesmatrix.mapper.CustomerMapper;
import com.salesmatrix.repository.BranchRepository;
import com.salesmatrix.repository.StoreRepository;
import com.salesmatrix.repository.CustomerRepository;
import com.salesmatrix.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CustomerMapper customerMapper;

    @Override
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Store store = storeRepository.findById(customerDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + customerDTO.getStoreId()));
        
        // Check if customer with same phone number already exists in this store
        customerRepository.findByPhoneNumberAndStoreId(customerDTO.getPhoneNumber(), customerDTO.getStoreId())
                .ifPresent(existingCustomer -> {
                    throw new RuntimeException("Customer with phone number " + customerDTO.getPhoneNumber() + " already exists in this store");
                });
        
        Branch branch = null;
        if (customerDTO.getBranchId() != null) {
            branch = branchRepository.findById(customerDTO.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + customerDTO.getBranchId()));
        }
        
        Customer customer = customerMapper.toEntity(customerDTO, store, branch);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(savedCustomer);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        return customerMapper.toDTO(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDTO> getCustomersByStoreId(Long storeId) {
        return customerRepository.findByStoreId(storeId)
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDTO> getCustomersByBranchId(Long branchId) {
        return customerRepository.findByBranchId(branchId)
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    @Override
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
        
        Store store = storeRepository.findById(customerDTO.getStoreId())
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + customerDTO.getStoreId()));
        
        Branch branch = null;
        if (customerDTO.getBranchId() != null) {
            branch = branchRepository.findById(customerDTO.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found with id: " + customerDTO.getBranchId()));
        }
        
        customerMapper.updateEntity(customer, customerDTO, store, branch);
        Customer updatedCustomer = customerRepository.save(customer);
        return customerMapper.toDTO(updatedCustomer);
    }

    @Override
    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}