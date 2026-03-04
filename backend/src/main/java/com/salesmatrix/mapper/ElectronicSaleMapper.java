package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicSaleDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.PaymentMethod;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ElectronicSaleMapper {

    public ElectronicSaleDTO toDTO(ElectronicSale sale) {
        if (sale == null) {
            return null;
        }

        ElectronicSaleDTO dto = ElectronicSaleDTO.builder()
                .id(sale.getId())
                // Historical price snapshots
                .costPriceAtSale(sale.getCostPriceAtSale())
                .salePrice(sale.getSalePrice())
                .quantity(sale.getQuantity())
                .totalAmount(sale.getTotalAmount())
                // Profit/Loss tracking
                .profit(sale.getProfit())
                .loss(sale.getLoss())
                // Credit tracking
                .isCreditSale(sale.getIsCreditSale())
                .creditAmount(sale.getCreditAmount())
                .amountPaid(sale.getAmountPaid())
                .balanceDue(sale.getBalanceDue())
                .paymentMethod(sale.getPaymentMethod() != null ? sale.getPaymentMethod().name() : null)
                .saleDate(sale.getSaleDate())
                .createdAt(sale.getCreatedAt())
                .updatedAt(sale.getUpdatedAt())
                .build();

        // Map Product
        if (sale.getProduct() != null) {
            dto.setElectronicProductId(sale.getProduct().getId());
            dto.setProductName(sale.getProduct().getName());
            dto.setProductSerialNumber(sale.getProduct().getSerialNumber());
        }

        // Map Store
        if (sale.getStore() != null) {
            dto.setStoreId(sale.getStore().getId());
            dto.setStoreName(sale.getStore().getName());
        }

        // Map Branch
        if (sale.getBranch() != null) {
            dto.setBranchId(sale.getBranch().getId());
            dto.setBranchName(sale.getBranch().getAddress());
        }

        // Map Customer
        if (sale.getCustomer() != null) {
            dto.setCustomerId(sale.getCustomer().getId());
            dto.setCustomerName(sale.getCustomer().getName());
            dto.setCustomerPhone(sale.getCustomer().getPhoneNumber());
        }

        // Map Broker (optional)
        if (sale.getBroker() != null) {
            dto.setBrokerId(sale.getBroker().getId());
            dto.setBrokerName(sale.getBroker().getName());
        }

        // Map ElectronicBrokerTransaction (optional)
        if (sale.getElectronicBrokerTransaction() != null) {
            dto.setElectronicBrokerTransactionId(sale.getElectronicBrokerTransaction().getId());
        }

        // Map createdBy (optional)
        if (sale.getCreatedBy() != null) {
            dto.setCreatedById(sale.getCreatedBy().getId());
            dto.setCreatedByName(sale.getCreatedBy().getName());
        }

        return dto;
    }

    public ElectronicSale toEntity(ElectronicSaleDTO dto, ElectronicProduct product, Store store, 
                                    Branch branch, Customer customer, ElectronicBroker broker,
                                    ElectronicBrokerTransaction brokerTransaction) {
        if (dto == null) {
            return null;
        }

        return ElectronicSale.builder()
                .id(dto.getId())
                .product(product)
                .store(store)
                .branch(branch)
                .customer(customer)
                .broker(broker)
                .electronicBrokerTransaction(brokerTransaction)
                .costPriceAtSale(dto.getCostPriceAtSale())
                .salePrice(dto.getSalePrice())
                .quantity(dto.getQuantity() != null ? dto.getQuantity() : 1)
                .totalAmount(dto.getTotalAmount())
                .profit(dto.getProfit())
                .loss(dto.getLoss())
                .isCreditSale(dto.getIsCreditSale())
                .creditAmount(dto.getCreditAmount())
                .amountPaid(dto.getAmountPaid())
                .balanceDue(dto.getBalanceDue())
                .paymentMethod(dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null)
                .build();
    }

    public void updateEntity(ElectronicSale sale, ElectronicSaleDTO dto, ElectronicProduct product,
                             Store store, Branch branch, Customer customer, ElectronicBroker broker,
                             ElectronicBrokerTransaction brokerTransaction) {
        if (dto == null || sale == null) {
            return;
        }

        sale.setProduct(product);
        sale.setStore(store);
        sale.setBranch(branch);
        sale.setCustomer(customer);
        sale.setBroker(broker);
        sale.setElectronicBrokerTransaction(brokerTransaction);
        sale.setCostPriceAtSale(dto.getCostPriceAtSale());
        sale.setSalePrice(dto.getSalePrice());
        sale.setQuantity(dto.getQuantity());
        sale.setTotalAmount(dto.getTotalAmount());
        sale.setProfit(dto.getProfit());
        sale.setLoss(dto.getLoss());
        sale.setIsCreditSale(dto.getIsCreditSale());
        sale.setCreditAmount(dto.getCreditAmount());
        sale.setAmountPaid(dto.getAmountPaid());
        sale.setBalanceDue(dto.getBalanceDue());
        sale.setPaymentMethod(dto.getPaymentMethod() != null ? PaymentMethod.valueOf(dto.getPaymentMethod()) : null);
    }

    public List<ElectronicSaleDTO> toDTOList(List<ElectronicSale> sales) {
        return sales.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
