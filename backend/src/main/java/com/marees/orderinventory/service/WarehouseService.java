package com.marees.orderinventory.service;

import com.marees.orderinventory.entity.Warehouse;
import com.marees.orderinventory.exception.ResourceNotFoundException;
import com.marees.orderinventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import com.marees.orderinventory.exception.DuplicateWarehouseCodeException;
import com.marees.orderinventory.dto.WarehouseResponse;
import com.marees.orderinventory.dto.WarehouseRequest;


import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public WarehouseResponse createWarehouse(WarehouseRequest request) {

        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new DuplicateWarehouseCodeException(
                    "Warehouse with code already exists: " + request.getCode()
            );
        }

        Warehouse warehouse = new Warehouse();

        warehouse.setCode(request.getCode());
        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setActive(request.getActive());

        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        return mapToResponse(savedWarehouse);
    }

    public List<WarehouseResponse> getAllWarehouses() {

        return warehouseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public WarehouseResponse getWarehouseById(Long id) {

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Warehouse not found with id: " + id)
                );

        return mapToResponse(warehouse);
    }

    public void deleteWarehouse(Long id) {

        if (!warehouseRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Warehouse not found with id: " + id
            );
        }

        warehouseRepository.deleteById(id);
    }

    public WarehouseResponse updateWarehouse(Long id, WarehouseRequest request) {

        if (warehouseRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new DuplicateWarehouseCodeException(
                    "Warehouse with code already exists: " + request.getCode()
            );
        }

        Warehouse existingWarehouse = warehouseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Warehouse not found with id: " + id)
                );

        existingWarehouse.setCode(request.getCode());
        existingWarehouse.setName(request.getName());
        existingWarehouse.setLocation(request.getLocation());
        existingWarehouse.setActive(request.getActive());

        Warehouse updatedWarehouse = warehouseRepository.save(existingWarehouse);

        return mapToResponse(updatedWarehouse);
    }

    private WarehouseResponse mapToResponse(Warehouse warehouse) {

        WarehouseResponse response = new WarehouseResponse();

        response.setId(warehouse.getId());
        response.setCode(warehouse.getCode());
        response.setName(warehouse.getName());
        response.setLocation(warehouse.getLocation());
        response.setActive(warehouse.getActive());
        response.setCreatedAt(warehouse.getCreatedAt());
        response.setUpdatedAt(warehouse.getUpdatedAt());

        return response;
    }
}