package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.OrderRequest;
import com.marees.orderinventory.dto.OrderResponse;
import com.marees.orderinventory.entity.Order;
import com.marees.orderinventory.entity.OrderItem;
import com.marees.orderinventory.exception.ResourceNotFoundException;
import com.marees.orderinventory.repository.OrderItemRepository;
import com.marees.orderinventory.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final InventoryService inventoryService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            InventoryService inventoryService) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.inventoryService = inventoryService;
    }

    // =========================
    // CREATE ORDER
    // =========================

    public OrderResponse createOrder(OrderRequest request) {

        Order order = new Order();

        order.setOrderNumber(generateOrderNumber());
        order.setStatus(request.getStatus());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    // =========================
    // GENERATE ORDER NUMBER
    // =========================

    private String generateOrderNumber() {

        long nextId = orderRepository.count() + 1;

        String orderNumber;

        do {
            orderNumber = String.format(
                    "ORD-%06d",
                    nextId
            );

            nextId++;

        } while (
                orderRepository.existsByOrderNumber(orderNumber)
        );

        return orderNumber;
    }

    // =========================
    // GET ALL ORDERS
    // =========================

    public List<OrderResponse> getAllOrders() {

        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // GET ORDER BY ID
    // =========================

    public OrderResponse getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + id
                        )
                );

        return mapToResponse(order);
    }

    // =========================
    // UPDATE ORDER
    // =========================

    public OrderResponse updateOrder(
            Long id,
            OrderRequest request) {

        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + id
                        )
                );

        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(id);

        boolean hasValidOrderItem =
                orderItems.stream()
                        .anyMatch(item ->
                                item.getQuantity() != null
                                        && item.getQuantity() >= 1
                        );

        if (!existingOrder.getStatus().equalsIgnoreCase(request.getStatus())
                && !hasValidOrderItem) {

            throw new IllegalArgumentException(
                    "Order must contain at least one item with quantity at least 1 before changing status."
            );
        }

        // =========================
        // ORDER NUMBER LIFECYCLE
        // =========================

        if (!existingOrder.getStatus().equalsIgnoreCase("PENDING")
                && !existingOrder.getStatus().equalsIgnoreCase("PROCESSING")
                && !existingOrder.getOrderNumber().equals(request.getOrderNumber())) {

            throw new IllegalStateException(
                    "Order number cannot be modified when order status is "
                            + existingOrder.getStatus()
            );
        }

        existingOrder.setOrderNumber(
                request.getOrderNumber()
        );

        // =========================
        // STATUS TRANSITION
        // =========================

        validateStatusTransition(
                existingOrder.getStatus(),
                request.getStatus()
        );

        existingOrder.setStatus(
                request.getStatus()
        );

        existingOrder.setUpdatedAt(
                LocalDateTime.now()
        );

        Order updatedOrder =
                orderRepository.save(existingOrder);

        return mapToResponse(updatedOrder);
    }

    // =========================
    // DELETE ORDER
    // =========================

    public void deleteOrder(Long id) {

        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + id
                        )
                );

        List<OrderItem> orderItems =
                orderItemRepository.findByOrderId(id);

        for (OrderItem orderItem : orderItems) {

            inventoryService.addStock(
                    orderItem.getProductId(),
                    orderItem.getWarehouseId(),
                    orderItem.getQuantity(),
                    orderItem.getId()
            );
        }

        orderRepository.delete(existingOrder);
    }

    // =========================
    // CALCULATE ORDER TOTAL
    // =========================

    public Double getOrderTotal(Long orderId) {

        orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );

        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .mapToDouble(OrderItem::getTotalPrice)
                .sum();
    }

    // =========================
    // STATUS TRANSITION
    // =========================

    private void validateStatusTransition(
            String currentStatus,
            String newStatus) {

        if (currentStatus.equalsIgnoreCase(newStatus)) {
            return;
        }

        boolean validTransition =
                (currentStatus.equalsIgnoreCase("PENDING")
                        && (newStatus.equalsIgnoreCase("PROCESSING")
                        || newStatus.equalsIgnoreCase("CANCELLED")))

                        || (currentStatus.equalsIgnoreCase("PROCESSING")
                        && (newStatus.equalsIgnoreCase("SHIPPED")
                        || newStatus.equalsIgnoreCase("CANCELLED")))

                        || (currentStatus.equalsIgnoreCase("SHIPPED")
                        && newStatus.equalsIgnoreCase("DELIVERED"));

        if (!validTransition) {

            throw new IllegalArgumentException(
                    "Invalid order status transition from "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }
    }

    // =========================
    // MAP ENTITY → RESPONSE
    // =========================

    private OrderResponse mapToResponse(Order order) {

        OrderResponse response = new OrderResponse();

        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        return response;
    }
}