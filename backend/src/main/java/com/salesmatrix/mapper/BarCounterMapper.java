package com.salesmatrix.mapper;

import com.salesmatrix.dto.BarCounterDTO;
import com.salesmatrix.entity.BarCounter;
import com.salesmatrix.entity.Store;
import org.springframework.stereotype.Component;

@Component
public class BarCounterMapper {

    public BarCounterDTO toDTO(BarCounter counter) {
        return BarCounterDTO.builder()
                .id(counter.getId())
                .name(counter.getName())
                .description(counter.getDescription())
                .active(counter.getActive())
                .storeId(counter.getStore().getId())
                .storeName(counter.getStore().getName())
                .build();
    }

    public BarCounter toEntity(BarCounterDTO dto, Store store) {
        return BarCounter.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .active(dto.getActive() != null ? dto.getActive() : true)
                .store(store)
                .build();
    }

    public void updateEntity(BarCounter counter, BarCounterDTO dto, Store store) {
        counter.setName(dto.getName());
        counter.setDescription(dto.getDescription());
        counter.setActive(dto.getActive() != null ? dto.getActive() : true);
        counter.setStore(store);
    }
}
