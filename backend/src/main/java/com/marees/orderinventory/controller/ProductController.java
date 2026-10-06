package com.marees.orderinventory.controller;

import com.marees.orderinventory.dto.ProductRequest;
import com.marees.orderinventory.dto.ProductResponse;
import com.marees.orderinventory.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ADMIN only
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest productRequest) {

        ProductResponse savedProduct =
                productService.createProduct(productRequest);

        return new ResponseEntity<>(
                savedProduct,
                HttpStatus.CREATED
        );
    }

    // USER + ADMIN
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    // USER + ADMIN
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    // ADMIN only
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest productRequest) {

        return ResponseEntity.ok(
                productService.updateProduct(
                        id,
                        productRequest
                )
        );
    }

    // ADMIN only
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }

    // USER + ADMIN
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                productService.searchProducts(keyword)
        );
    }

    // USER + ADMIN
    @GetMapping("/page")
    public ResponseEntity<Page<ProductResponse>> getProductsWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return ResponseEntity.ok(
                productService.getProductsWithPagination(
                        page,
                        size,
                        sortBy,
                        direction
                )
        );
    }
}