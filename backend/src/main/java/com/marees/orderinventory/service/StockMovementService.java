package com.marees.orderinventory.service;

import com.marees.orderinventory.entity.StockMovement;
import com.marees.orderinventory.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockMovementService {

    private final StockMovementRepository stockMovementRepository;

    public StockMovementService(
            StockMovementRepository stockMovementRepository) {

        this.stockMovementRepository = stockMovementRepository;
    }

    public void recordMovement(
            Long productId,
            Long warehouseId,
            Integer quantity,
            String movementType,
            String referenceType,
            Long referenceId) {

        StockMovement movement = new StockMovement();

        movement.setProductId(productId);
        movement.setWarehouseId(warehouseId);
        movement.setQuantity(quantity);
        movement.setMovementType(movementType);
        movement.setReferenceType(referenceType);
        movement.setReferenceId(referenceId);
        movement.setCreatedAt(LocalDateTime.now());

        stockMovementRepository.save(movement);
    }

    public List<StockMovement> getAllMovements() {

        return stockMovementRepository.findAll();
    }
}