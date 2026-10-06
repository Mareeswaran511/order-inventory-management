package com.marees.orderinventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WarehouseRequest {

    @NotBlank(message = "Warehouse code is required")
    private String code;

    @NotBlank(message = "Warehouse name is required")
    private String name;

    private String location;

    @NotNull(message = "Active status is required")
    private Boolean active;
}