package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.OrderItemRequest;
import com.marees.orderinventory.dto.OrderItemResponse;
import com.marees.orderinventory.entity.OrderItem;
import com.marees.orderinventory.entity.Order;
import com.marees.orderinventory.exception.ResourceNotFoundException;
import com.marees.orderinventory.repository.OrderItemRepository;
import com.marees.orderinventory.repository.OrderRepository;
import com.marees.orderinventory.repository.ProductRepository;
import com.marees.orderinventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryService inventoryService;

    public OrderItemService(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryService inventoryService) {

        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public OrderItemResponse createOrderItem(OrderItemRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + request.getOrderId()
                        )
                );

        validateOrderItemModification(order);

        productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + request.getProductId()
                        )
                );

        warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found with id: " + request.getWarehouseId()
                        )
                );

        boolean duplicateExists =
                orderItemRepository.existsByOrderIdAndProductIdAndWarehouseId(
                        request.getOrderId(),
                        request.getProductId(),
                        request.getWarehouseId()
                );

        if (duplicateExists) {
            throw new IllegalStateException(
                    "This product is already added to the order for the selected warehouse."
            );
        }

        OrderItem orderItem = new OrderItem();

        orderItem.setOrderId(request.getOrderId());
        orderItem.setProductId(request.getProductId());
        orderItem.setWarehouseId(request.getWarehouseId());
        orderItem.setQuantity(request.getQuantity());
        orderItem.setUnitPrice(request.getUnitPrice());

        double totalPrice =
                request.getQuantity() * request.getUnitPrice();

        orderItem.setTotalPrice(totalPrice);

        OrderItem savedOrderItem =
                orderItemRepository.save(orderItem);

        inventoryService.deductStock(
                request.getProductId(),
                request.getWarehouseId(),
                request.getQuantity(),
                savedOrderItem.getId()
        );

        return mapToResponse(savedOrderItem);
    }

    public List<OrderItemResponse> getAllOrderItems() {

        return orderItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {

        orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: " + orderId
                        )
                );

        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderItemResponse getOrderItemById(Long id) {

        OrderItem orderItem =
                orderItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order item not found with id: " + id
                                )
                        );

        return mapToResponse(orderItem);
    }

    @Transactional
    public OrderItemResponse updateOrderItem(
            Long id,
            OrderItemRequest request) {

        OrderItem existingOrderItem =
                orderItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order item not found with id: " + id
                                )
                        );

        Order order = orderRepository.findById(existingOrderItem.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: "
                                        + existingOrderItem.getOrderId()
                        )
                );

        validateOrderItemModification(order);

        productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + request.getProductId()
                        )
                );

        warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Warehouse not found with id: " + request.getWarehouseId()
                        )
                );

        boolean duplicateExists =
                orderItemRepository.existsByOrderIdAndProductIdAndWarehouseIdAndIdNot(
                        existingOrderItem.getOrderId(),
                        request.getProductId(),
                        request.getWarehouseId(),
                        existingOrderItem.getId()
                );

        if (duplicateExists) {
            throw new IllegalStateException(
                    "This product is already added to the order for the selected warehouse."
            );
        }

        int oldQuantity = existingOrderItem.getQuantity();
        int newQuantity = request.getQuantity();

        int quantityDifference = newQuantity - oldQuantity;

        if (quantityDifference > 0) {

            inventoryService.deductStock(
                    request.getProductId(),
                    request.getWarehouseId(),
                    quantityDifference,
                    existingOrderItem.getId()
            );

        } else if (quantityDifference < 0) {

            inventoryService.addStock(
                    request.getProductId(),
                    request.getWarehouseId(),
                    Math.abs(quantityDifference),
                    existingOrderItem.getId()
            );
        }

        existingOrderItem.setOrderId(request.getOrderId());
        existingOrderItem.setProductId(request.getProductId());
        existingOrderItem.setWarehouseId(request.getWarehouseId());
        existingOrderItem.setQuantity(newQuantity);
        existingOrderItem.setUnitPrice(request.getUnitPrice());

        existingOrderItem.setTotalPrice(
                newQuantity * request.getUnitPrice()
        );

        OrderItem updatedOrderItem =
                orderItemRepository.save(existingOrderItem);

        return mapToResponse(updatedOrderItem);
    }

    @Transactional
    public void deleteOrderItem(Long id) {

        OrderItem existingOrderItem =
                orderItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Order item not found with id: " + id
                                )
                        );

        Order order = orderRepository.findById(existingOrderItem.getOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with id: "
                                        + existingOrderItem.getOrderId()
                        )
                );

        validateOrderItemModification(order);

        inventoryService.addStock(
                existingOrderItem.getProductId(),
                existingOrderItem.getWarehouseId(),
                existingOrderItem.getQuantity(),
                existingOrderItem.getId()
        );

        orderItemRepository.delete(existingOrderItem);
    }

    /**
     * Order items can only be added, updated, or deleted
     * while the order is in PENDING or PROCESSING status.
     */
    private void validateOrderItemModification(Order order) {

        String status = order.getStatus();

        if (!"PENDING".equals(status) && !"PROCESSING".equals(status)) {

            throw new IllegalStateException(
                    "Order items cannot be modified when order status is "
                            + status
            );
        }
    }

    private OrderItemResponse mapToResponse(OrderItem orderItem) {

        OrderItemResponse response = new OrderItemResponse();

        response.setId(orderItem.getId());
        response.setOrderId(orderItem.getOrderId());
        response.setProductId(orderItem.getProductId());
        response.setWarehouseId(orderItem.getWarehouseId());
        response.setQuantity(orderItem.getQuantity());
        response.setUnitPrice(orderItem.getUnitPrice());
        response.setTotalPrice(orderItem.getTotalPrice());

        return response;
    }
}