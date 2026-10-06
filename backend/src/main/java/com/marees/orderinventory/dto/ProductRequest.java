package com.marees.orderinventory.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.NotNull;

public class ProductRequest {

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @PositiveOrZero(message = "Price must be zero or greater")
    private BigDecimal price;

    @PositiveOrZero(message = "Reorder level must be zero or greater")
    private Integer reorderLevel;

    @NotNull(message = "Active status is required")
    private Boolean active;

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getReorderLevel() {
        return reorderLevel;
    }

    public void setReorderLevel(Integer reorderLevel) {
        this.reorderLevel = reorderLevel;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}