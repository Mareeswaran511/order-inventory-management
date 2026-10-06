package com.marees.orderinventory.repository;

import com.marees.orderinventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    boolean existsBySkuAndIdNot(String sku, Long id);

    List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
            String name,
            String sku
    );
}