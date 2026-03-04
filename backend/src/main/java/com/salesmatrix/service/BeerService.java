package com.salesmatrix.service;

import com.salesmatrix.dto.BeerDTO;

import java.util.List;

public interface BeerService {

    BeerDTO createBeer(BeerDTO beerDTO);

    BeerDTO getBeerById(Long id);

    List<BeerDTO> getAllBeers();

    List<BeerDTO> getBeersByStoreId(Long storeId);

    List<BeerDTO> getBeersByBrand(String brand);

    BeerDTO updateBeer(Long id, BeerDTO beerDTO);

    void deleteBeer(Long id);
}
