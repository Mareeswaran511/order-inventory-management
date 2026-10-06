package com.marees.orderinventory.controller;

import com.marees.orderinventory.dto.WarehouseRequest;
import com.marees.orderinventory.dto.WarehouseResponse;
import com.marees.orderinventory.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @PostMapping
    public ResponseEntity<WarehouseResponse> createWarehouse(
            @Valid @RequestBody WarehouseRequest request) {

        WarehouseResponse response = warehouseService.createWarehouse(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> getAllWarehouses() {

        List<WarehouseResponse> warehouses =
                warehouseService.getAllWarehouses();

        return ResponseEntity.ok(warehouses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseResponse> getWarehouseById(
            @PathVariable Long id) {

        WarehouseResponse response = warehouseService.getWarehouseById(id);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable Long id) {

        warehouseService.deleteWarehouse(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<WarehouseResponse> updateWarehouse(
            @PathVariable Long id,
            @Valid @RequestBody WarehouseRequest request) {

        WarehouseResponse response =
                warehouseService.updateWarehouse(id, request);

        return ResponseEntity.ok(response);
    }
}