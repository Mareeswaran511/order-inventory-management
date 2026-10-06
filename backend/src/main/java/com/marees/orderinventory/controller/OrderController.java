package com.marees.orderinventory.controller;

import com.marees.orderinventory.dto.OrderRequest;
import com.marees.orderinventory.dto.OrderResponse;
import com.marees.orderinventory.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create Order
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request) {

        OrderResponse response =
                orderService.createOrder(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // Get All Orders
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // Get Order Total
    @GetMapping("/{id}/total")
    public ResponseEntity<Double> getOrderTotal(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getOrderTotal(id)
        );
    }

    // Get Order By ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    // Update Order
    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequest request) {

        return ResponseEntity.ok(
                orderService.updateOrder(id, request)
        );
    }

    // Delete Order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(
            @PathVariable Long id) {

        orderService.deleteOrder(id);

        return ResponseEntity.noContent().build();
    }
}