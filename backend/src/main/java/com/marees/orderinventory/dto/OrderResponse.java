package com.marees.orderinventory.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class OrderResponse {

    private Long id;

    private String orderNumber;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}