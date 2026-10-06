package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.InventoryRequest;
import com.marees.orderinventory.dto.InventoryResponse;
import com.marees.orderinventory.entity.Inventory;
import com.marees.orderinventory.exception.ResourceNotFoundException;
import com.marees.orderinventory.repository.InventoryRepository;
import com.marees.orderinventory.repository.ProductRepository;
import com.marees.orderinventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementService stockMovementService;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            StockMovementService stockMovementService) {

        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.stockMovementService = stockMovementService;
    }

    public InventoryResponse createInventory(InventoryRequest request) {

        validateProductAndWarehouse(
                request.getProductId(),
                request.getWarehouseId()
        );

        Inventory inventory = new Inventory();

        inventory.setProductId(request.getProductId());
        inventory.setWarehouseId(request.getWarehouseId());
        inventory.setQuantity(request.getQuantity());

        Inventory savedInventory = inventoryRepository.save(inventory);

        return mapToResponse(savedInventory);
    }

    public List<InventoryResponse> getAllInventory() {

        return inventoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public InventoryResponse getInventoryById(Long id) {

        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory not found with id: " + id
                        )
                );

        return mapToResponse(inventory);
    }

    public InventoryResponse updateInventory(
            Long id,
            InventoryRequest request) {

        validateProductAndWarehouse(
                request.getProductId(),
                request.getWarehouseId()
        );

        Inventory existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory not found with id: " + id
                        )
                );

        existingInventory.setProductId(request.getProductId());
        existingInventory.setWarehouseId(request.getWarehouseId());
        existingInventory.setQuantity(request.getQuantity());

        Inventory updatedInventory =
                inventoryRepository.save(existingInventory);

        return mapToResponse(updatedInventory);
    }

    public void deleteInventory(Long id) {

        Inventory existingInventory = inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Inventory not found with id: " + id
                        )
                );

        inventoryRepository.delete(existingInventory);
    }

    private void validateProductAndWarehouse(
            Long productId,
            Long warehouseId) {

        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException(
                    "Product not found with id: " + productId
            );
        }

        if (!warehouseRepository.existsById(warehouseId)) {
            throw new ResourceNotFoundException(
                    "Warehouse not found with id: " + warehouseId
            );
        }
    }

    private InventoryResponse mapToResponse(Inventory inventory) {

        InventoryResponse response = new InventoryResponse();

        response.setId(inventory.getId());
        response.setProductId(inventory.getProductId());
        response.setWarehouseId(inventory.getWarehouseId());
        response.setQuantity(inventory.getQuantity());
        response.setCreatedAt(inventory.getCreatedAt());
        response.setUpdatedAt(inventory.getUpdatedAt());

        return response;
    }


    // Deduct Stock
    public void deductStock(
            Long productId, Long warehouseId, Integer quantity, Long referenceId ) {

        Inventory inventory =
                inventoryRepository
                        .findByProductIdAndWarehouseId(
                                productId,
                                warehouseId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Inventory not found for product: "
                                                + productId
                                                + " and warehouse: "
                                                + warehouseId
                                )
                        );

        if (inventory.getQuantity() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient stock. Available quantity: "
                            + inventory.getQuantity()
                            + ", requested quantity: "
                            + quantity
                            + "."
            );
        }

        inventory.setQuantity(
                inventory.getQuantity() - quantity
        );

        inventoryRepository.save(inventory);

        stockMovementService.recordMovement(
                productId,
                warehouseId,
                quantity,
                "OUT",
                "ORDER",
                referenceId
        );
    }

    public void addStock(Long productId, Long warehouseId, Integer quantity,
                         Long referenceId) {

        Inventory inventory =
                inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Inventory not found for product: " + productId
                                                + " and warehouse: " + warehouseId
                                )
                        );

        inventory.setQuantity(inventory.getQuantity() + quantity);

        inventoryRepository.save(inventory);

        stockMovementService.recordMovement(
                productId,
                warehouseId,
                quantity,
                "IN",
                "ORDER",
                referenceId
        );
    }
}