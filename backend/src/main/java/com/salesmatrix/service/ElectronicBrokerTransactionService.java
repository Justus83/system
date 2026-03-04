package com.salesmatrix.service;

import com.salesmatrix.dto.ElectronicBrokerTransactionDTO;
import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.enums.BrokerTransactionStatus;
import com.salesmatrix.enums.PaymentMethod;

import java.util.List;

public interface ElectronicBrokerTransactionService {

    ElectronicBrokerTransactionDTO createTransaction(ElectronicBrokerTransactionDTO dto);

    ElectronicBrokerTransactionDTO getTransactionById(Long id);

    List<ElectronicBrokerTransactionDTO> getAllTransactions();

    List<ElectronicBrokerTransactionDTO> getTransactionsByStore(Long storeId);

    List<ElectronicBrokerTransactionDTO> getTransactionsByBranch(Long branchId);

    List<ElectronicBrokerTransactionDTO> getTransactionsByBroker(Long brokerId);

    List<ElectronicBrokerTransactionDTO> getTransactionsByProduct(Long productId);

    List<ElectronicBrokerTransactionDTO> getTransactionsByStatus(BrokerTransactionStatus status);

    ElectronicBrokerTransactionDTO updateTransaction(Long id, ElectronicBrokerTransactionDTO dto);

    ElectronicBrokerTransactionDTO updateTransactionStatus(Long id, BrokerTransactionStatus status);

    ElectronicSaleDTO markAsSold(Long id, Long customerId, PaymentMethod paymentMethod);

    void deleteTransaction(Long id);
}
