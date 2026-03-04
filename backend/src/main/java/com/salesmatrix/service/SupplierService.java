package com.salesmatrix.service;

import com.salesmatrix.dto.SupplierDTO;

import java.util.List;

public interface SupplierService {

    SupplierDTO createSupplier(SupplierDTO supplierDTO);

    SupplierDTO getSupplierById(Long id);

    List<SupplierDTO> getAllSuppliers();

    List<SupplierDTO> getSuppliersByStoreId(Long storeId);

    SupplierDTO updateSupplier(Long id, SupplierDTO supplierDTO);

    void deleteSupplier(Long id);
}