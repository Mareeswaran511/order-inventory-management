package com.marees.orderinventory.repository;

import com.marees.orderinventory.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

    boolean existsByCode(String code);

    boolean existsByCodeAndIdNot(String code, Long id);
}