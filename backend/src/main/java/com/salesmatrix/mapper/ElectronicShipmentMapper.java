package com.salesmatrix.mapper;

import com.salesmatrix.dto.ElectronicShipmentDTO;
import com.salesmatrix.entity.ElectronicInvestment;
import com.salesmatrix.entity.ElectronicShipment;
import com.salesmatrix.entity.Store;
import com.salesmatrix.repository.ElectronicInvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ElectronicShipmentMapper {

    private final ElectronicInvestmentRepository investmentRepository;

    public ElectronicShipmentDTO toDTO(ElectronicShipment shipment) {
        if (shipment == null) {
            return null;
        }

        String invoiceNumber = null;
        if (shipment.getInvoiceId() != null) {
            invoiceNumber = investmentRepository.findById(shipment.getInvoiceId())
                    .map(ElectronicInvestment::getInvoiceNumber)
                    .orElse(null);
        }

        return ElectronicShipmentDTO.builder()
                .id(shipment.getId())
                .invoiceId(shipment.getInvoiceId())
                .invoiceNumber(invoiceNumber)
                .storeId(shipment.getStore() != null ? shipment.getStore().getId() : null)
                .storeName(shipment.getStore() != null ? shipment.getStore().getName() : null)
                .date(shipment.getDate())
                .stockExpected(shipment.getStockExpected())
                .stockBrought(shipment.getStockBrought())
                .productDetails(shipment.getProductDetails())
                .createdAt(shipment.getCreatedAt())
                .build();
    }

    public ElectronicShipment toEntity(ElectronicShipmentDTO dto, Store store) {
        if (dto == null) {
            return null;
        }

        return ElectronicShipment.builder()
                .id(dto.getId())
                .invoiceId(dto.getInvoiceId())
                .store(store)
                .date(dto.getDate())
                .stockExpected(dto.getStockExpected())
                .stockBrought(dto.getStockBrought() != null ? dto.getStockBrought() : 0)
                .productDetails(dto.getProductDetails())
                .build();
    }
}
