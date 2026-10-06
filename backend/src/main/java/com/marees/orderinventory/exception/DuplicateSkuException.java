package com.marees.orderinventory.exception;

public class DuplicateSkuException extends RuntimeException {

    public DuplicateSkuException(String message) {
        super(message);
    }
}