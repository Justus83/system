package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicBrokerTransactionDTO;
import com.salesmatrix.entity.*;
import com.salesmatrix.enums.BrokerTransactionStatus;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Component;

@Component
public class ElectronicBrokerTransactionMapper {

    public ElectronicBrokerTransaction toEntity(ElectronicBrokerTransactionDTO dto, Store store, Branch branch,
                                                ElectronicProduct electronicProduct, ElectronicBroker broker) {
        return ElectronicBrokerTransaction.builder()
                .store(store)
                .branch(branch)
                .electronicProduct(electronicProduct)
                .broker(broker)
                .status(dto.getStatus() != null ? BrokerTransactionStatus.valueOf(dto.getStatus()) : BrokerTransactionStatus.TAKEN)
                .takenAt(dto.getTakenAt())
                .returnedAt(dto.getReturnedAt())
                .soldAt(dto.getSoldAt())
                .sellingPrice(dto.getSellingPrice())
                .amountPaid(dto.getAmountPaid())
                .paymentMethod(dto.getPaymentMethod())
                .build();
    }

    public ElectronicBrokerTransactionDTO toDTO(ElectronicBrokerTransaction transaction) {
        ElectronicProduct product = transaction.getElectronicProduct();
        
        // Extract color, storage, and RAM from the product
        String color = null;
        String storageSize = null;
        String ramSize = null;
        
        if (product != null) {
            if (product instanceof Smartphone) {
                Smartphone smartphone = (Smartphone) product;
                color = smartphone.getColor() != null ? smartphone.getColor().getName() : null;
                storageSize = smartphone.getStorageSize() != null ? smartphone.getStorageSize().getName() : null;
                ramSize = smartphone.getRamSize() != null ? smartphone.getRamSize().getName() : null;
            } else if (product instanceof Laptop) {
                Laptop laptop = (Laptop) product;
                color = laptop.getColor() != null ? laptop.getColor().getName() : null;
                storageSize = laptop.getStorageSize() != null ? laptop.getStorageSize().getName() : null;
                ramSize = laptop.getRamSize() != null ? laptop.getRamSize().getName() : null;
            } else if (product instanceof Tablet) {
                Tablet tablet = (Tablet) product;
                color = tablet.getColor() != null ? tablet.getColor().getName() : null;
                storageSize = tablet.getStorageSize() != null ? tablet.getStorageSize().getName() : null;
                ramSize = tablet.getRamSize() != null ? tablet.getRamSize().getName() : null;
            } else if (product instanceof Smartwatch) {
                Smartwatch smartwatch = (Smartwatch) product;
                color = smartwatch.getColor() != null ? smartwatch.getColor().getName() : null;
                // Smartwatch doesn't have storage or RAM
            } else if (product instanceof TV) {
                TV tv = (TV) product;
                color = tv.getColor() != null ? tv.getColor().getName() : null;
            }
            // Accessory doesn't have color, storage, or RAM
        }
        
        return ElectronicBrokerTransactionDTO.builder()
                .id(transaction.getId())
                .storeId(transaction.getStore() != null ? transaction.getStore().getId() : null)
                .storeName(transaction.getStore() != null ? transaction.getStore().getName() : null)
                .branchId(transaction.getBranch() != null ? transaction.getBranch().getId() : null)
                .branchAddress(transaction.getBranch() != null ? transaction.getBranch().getAddress() : null)
                .electronicProductId(product != null ? product.getId() : null)
                .productSerialNumber(product != null ? product.getSerialNumber() : null)
                .productModel(product != null ? product.getName() : null)
                .productType(product != null ? Hibernate.getClass(product).getSimpleName() : null)
                .productColor(color)
                .productStorageSize(storageSize)
                .productRamSize(ramSize)
                .brokerId(transaction.getBroker() != null ? transaction.getBroker().getId() : null)
                .brokerName(transaction.getBroker() != null ? transaction.getBroker().getName() : null)
                .brokerShopName(transaction.getBroker() != null ? transaction.getBroker().getShopName() : null)
                .status(transaction.getStatus() != null ? transaction.getStatus().name() : null)
                .takenAt(transaction.getTakenAt())
                .returnedAt(transaction.getReturnedAt())
                .soldAt(transaction.getSoldAt())
                .sellingPrice(transaction.getSellingPrice())
                .amountPaid(transaction.getAmountPaid())
                .paymentMethod(transaction.getPaymentMethod())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    public void updateEntity(ElectronicBrokerTransaction transaction, ElectronicBrokerTransactionDTO dto,
                              Store store, Branch branch, ElectronicProduct electronicProduct, 
                              ElectronicBroker broker) {
        transaction.setStore(store);
        transaction.setBranch(branch);
        transaction.setElectronicProduct(electronicProduct);
        transaction.setBroker(broker);
        transaction.setStatus(dto.getStatus() != null ? BrokerTransactionStatus.valueOf(dto.getStatus()) : BrokerTransactionStatus.TAKEN);
        transaction.setTakenAt(dto.getTakenAt());
        transaction.setReturnedAt(dto.getReturnedAt());
        transaction.setSoldAt(dto.getSoldAt());
        transaction.setSellingPrice(dto.getSellingPrice());
        transaction.setAmountPaid(dto.getAmountPaid());
        transaction.setPaymentMethod(dto.getPaymentMethod());
    }
}
