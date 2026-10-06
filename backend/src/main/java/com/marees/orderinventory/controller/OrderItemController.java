package com.marees.orderinventory.controller;

import com.marees.orderinventory.dto.OrderItemRequest;
import com.marees.orderinventory.dto.OrderItemResponse;
import com.marees.orderinventory.service.OrderItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    // Create Order Item
    @PostMapping
    public ResponseEntity<OrderItemResponse> createOrderItem(
            @Valid @RequestBody OrderItemRequest request) {

        OrderItemResponse response =
                orderItemService.createOrderItem(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // Get All Order Items
    @GetMapping
    public ResponseEntity<List<OrderItemResponse>> getAllOrderItems() {

        return ResponseEntity.ok(
                orderItemService.getAllOrderItems()
        );
    }

    // Get Order Items By Order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderItemService.getOrderItemsByOrderId(orderId)
        );
    }

    // Get Order Item By ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItemResponse> getOrderItemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                orderItemService.getOrderItemById(id)
        );
    }


    // Update Order Item
    @PutMapping("/{id}")
    public ResponseEntity<OrderItemResponse> updateOrderItem(
            @PathVariable Long id,
            @Valid @RequestBody OrderItemRequest request) {

        return ResponseEntity.ok(
                orderItemService.updateOrderItem(id, request)
        );
    }

    // Delete Order Item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(
            @PathVariable Long id) {

        orderItemService.deleteOrderItem(id);

        return ResponseEntity.noContent().build();
    }
}