package com.backend.taskmaster.exceptions;

public class OperationNotPermittedException extends RuntimeException {
    
    public OperationNotPermittedException() {
    }

    public OperationNotPermittedException(String message) {
        super(message);
    }
}
