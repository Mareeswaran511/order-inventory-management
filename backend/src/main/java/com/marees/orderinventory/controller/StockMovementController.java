package com.marees.orderinventory.controller;

import com.marees.orderinventory.entity.StockMovement;
import com.marees.orderinventory.service.StockMovementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stock-movements")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(
            StockMovementService stockMovementService) {

        this.stockMovementService = stockMovementService;
    }

    @GetMapping
    public List<StockMovement> getAllMovements() {

        return stockMovementService.getAllMovements();
    }
}