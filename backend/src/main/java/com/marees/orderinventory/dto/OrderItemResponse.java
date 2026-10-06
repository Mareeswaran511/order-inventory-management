package com.marees.orderinventory.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemResponse {

    private Long id;
    private Long orderId;
    private Long productId;
    private Long warehouseId;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
}