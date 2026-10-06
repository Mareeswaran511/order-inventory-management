package com.marees.orderinventory.repository;

import com.marees.orderinventory.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);
}