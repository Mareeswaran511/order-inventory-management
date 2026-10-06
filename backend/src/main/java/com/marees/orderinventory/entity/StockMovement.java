package com.marees.orderinventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;

    private Long warehouseId;

    private Integer quantity;

    private String movementType;

    private String referenceType;

    private Long referenceId;

    private LocalDateTime createdAt;
}