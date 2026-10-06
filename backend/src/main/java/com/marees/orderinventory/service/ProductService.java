package com.marees.orderinventory.service;

import com.marees.orderinventory.dto.ProductRequest;
import com.marees.orderinventory.dto.ProductResponse;
import com.marees.orderinventory.entity.Product;
import com.marees.orderinventory.exception.ResourceNotFoundException;
import com.marees.orderinventory.repository.ProductRepository;

import com.marees.orderinventory.exception.DuplicateSkuException;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET ALL PRODUCTS
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(product -> {

                    ProductResponse response = new ProductResponse();

                    response.setId(product.getId());
                    response.setSku(product.getSku());
                    response.setName(product.getName());
                    response.setDescription(product.getDescription());
                    response.setPrice(product.getPrice());
                    response.setReorderLevel(product.getReorderLevel());
                    response.setActive(product.getActive());
                    response.setCreatedAt(product.getCreatedAt());
                    response.setUpdatedAt(product.getUpdatedAt());

                    return response;
                })
                .toList();
    }

    // GET PRODUCT BY ID
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        ProductResponse response = new ProductResponse();

        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setReorderLevel(product.getReorderLevel());
        response.setActive(product.getActive());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());

        return response;
    }

    // SEARCH PRODUCTS
    public List<ProductResponse> searchProducts(String keyword) {

        return productRepository
                .findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(
                        keyword,
                        keyword
                )
                .stream()
                .map(product -> {
                    ProductResponse response = new ProductResponse();

                    response.setId(product.getId());
                    response.setSku(product.getSku());
                    response.setName(product.getName());
                    response.setDescription(product.getDescription());
                    response.setPrice(product.getPrice());
                    response.setReorderLevel(product.getReorderLevel());
                    response.setActive(product.getActive());
                    response.setCreatedAt(product.getCreatedAt());
                    response.setUpdatedAt(product.getUpdatedAt());

                    return response;
                })
                .toList();
    }

    // CREATE PRODUCT
    public ProductResponse createProduct(ProductRequest productRequest) {

        if (productRepository.existsBySku(productRequest.getSku())) {
            throw new DuplicateSkuException(
                    "Product with SKU already exists: " + productRequest.getSku()
            );
        }

        Product product = new Product();

        product.setSku(productRequest.getSku());
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setReorderLevel(productRequest.getReorderLevel());
        product.setActive(productRequest.getActive());

        Product savedProduct = productRepository.save(product);

        ProductResponse response = new ProductResponse();

        response.setId(savedProduct.getId());
        response.setSku(savedProduct.getSku());
        response.setName(savedProduct.getName());
        response.setDescription(savedProduct.getDescription());
        response.setPrice(savedProduct.getPrice());
        response.setReorderLevel(savedProduct.getReorderLevel());
        response.setActive(savedProduct.getActive());
        response.setCreatedAt(savedProduct.getCreatedAt());
        response.setUpdatedAt(savedProduct.getUpdatedAt());

        return response;
    }

    // UPDATE PRODUCT
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        if (productRepository.existsBySkuAndIdNot(
                productRequest.getSku(), id)) {

            throw new DuplicateSkuException(
                    "Product with SKU already exists: "
                            + productRequest.getSku()
            );
        }
        existingProduct.setSku(productRequest.getSku());
        existingProduct.setName(productRequest.getName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setReorderLevel(productRequest.getReorderLevel());
        existingProduct.setActive(productRequest.getActive());

        Product updatedProduct = productRepository.save(existingProduct);

        ProductResponse response = new ProductResponse();

        response.setId(updatedProduct.getId());
        response.setSku(updatedProduct.getSku());
        response.setName(updatedProduct.getName());
        response.setDescription(updatedProduct.getDescription());
        response.setPrice(updatedProduct.getPrice());
        response.setReorderLevel(updatedProduct.getReorderLevel());
        response.setActive(updatedProduct.getActive());
        response.setCreatedAt(updatedProduct.getCreatedAt());
        response.setUpdatedAt(updatedProduct.getUpdatedAt());

        return response;
    }

    // DELETE PRODUCT
    public void deleteProduct(Long id) {

        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found with id: " + id));

        productRepository.delete(existingProduct);
    }

    // GET PRODUCTS WITH PAGINATION AND SORTING
    public Page<ProductResponse> getProductsWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Page<Product> products = productRepository.findAll(
                PageRequest.of(page, size, sort)
        );

        return products.map(product -> {
            ProductResponse response = new ProductResponse();

            response.setId(product.getId());
            response.setSku(product.getSku());
            response.setName(product.getName());
            response.setDescription(product.getDescription());
            response.setPrice(product.getPrice());
            response.setReorderLevel(product.getReorderLevel());
            response.setActive(product.getActive());
            response.setCreatedAt(product.getCreatedAt());
            response.setUpdatedAt(product.getUpdatedAt());

            return response;
        });
    }
}