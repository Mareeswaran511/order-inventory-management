package com.marees.orderinventory.repository;

import com.marees.orderinventory.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    boolean existsByOrderIdAndProductIdAndWarehouseId(
            Long orderId,
            Long productId,
            Long warehouseId
    );

    boolean existsByOrderIdAndProductIdAndWarehouseIdAndIdNot(
            Long orderId,
            Long productId,
            Long warehouseId,
            Long id
    );
}