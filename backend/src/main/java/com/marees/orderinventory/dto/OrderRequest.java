package com.marees.orderinventory.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {

    private String orderNumber;

    @NotBlank(message = "Order status is required")
    private String status;
}