package com.salesmatrix.service;

import com.salesmatrix.dto.TabletDTO;

import java.util.List;

public interface TabletService {

    TabletDTO createTablet(TabletDTO tabletDTO);

    TabletDTO getTabletById(Long id);

    List<TabletDTO> getAllTablets();

    List<TabletDTO> getTabletsByStoreId(Long storeId);

    List<TabletDTO> getTabletsByBrand(String brand);

    TabletDTO getTabletBySerialNumber(String serialNumber);

    TabletDTO updateTablet(Long id, TabletDTO tabletDTO);

    void deleteTablet(Long id);
}
