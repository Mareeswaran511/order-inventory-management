package com.marees.orderinventory.controller;

import com.marees.orderinventory.dto.InventoryRequest;
import com.marees.orderinventory.dto.InventoryResponse;
import com.marees.orderinventory.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody InventoryRequest request) {

        InventoryResponse response =
                inventoryService.createInventory(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {

        return ResponseEntity.ok(
                inventoryService.getAllInventory()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryResponse> getInventoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                inventoryService.getInventoryById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable Long id,
            @Valid @RequestBody InventoryRequest request) {

        return ResponseEntity.ok(
                inventoryService.updateInventory(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(
            @PathVariable Long id) {

        inventoryService.deleteInventory(id);

        return ResponseEntity.noContent().build();
    }
}