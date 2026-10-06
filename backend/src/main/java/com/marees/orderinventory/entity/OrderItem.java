package com.marees.orderinventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;

    private Long productId;

    private Long warehouseId;

    private Integer quantity;

    private Double unitPrice;

    private Double totalPrice;
}