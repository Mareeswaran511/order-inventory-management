package com.marees.orderinventory.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InventoryResponse {

    private Long id;

    private Long productId;

    private Long warehouseId;

    private Integer quantity;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}