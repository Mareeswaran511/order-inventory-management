package com.marees.orderinventory.exception;

public class DuplicateWarehouseCodeException extends RuntimeException {

    public DuplicateWarehouseCodeException(String message) {
        super(message);
    }
}