package com.marees.orderinventory.repository;

import com.marees.orderinventory.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndWarehouseId(
            Long productId,
            Long warehouseId
    );
}