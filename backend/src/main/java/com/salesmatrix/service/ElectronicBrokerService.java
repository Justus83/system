package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicBrokerDTO;

import java.util.List;

public interface ElectronicBrokerService {

    ElectronicBrokerDTO createElectronicBroker(ElectronicBrokerDTO electronicBrokerDTO);

    ElectronicBrokerDTO getElectronicBrokerById(Long id);

    List<ElectronicBrokerDTO> getAllElectronicBrokers();

    List<ElectronicBrokerDTO> getElectronicBrokersByStoreId(Long storeId);

    ElectronicBrokerDTO updateElectronicBroker(Long id, ElectronicBrokerDTO electronicBrokerDTO);

    void deleteElectronicBroker(Long id);
}