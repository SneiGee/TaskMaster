package com.backend.taskmaster.observer;

public interface TaskObserverInterface {
    void onTaskCreated(String message);
    void onTaskUpdated(String message);
    void onTaskDeleted(String message);
    void onTaskPriorityCreated(String message);
    void onTaskMarkCompleted(String message);
}
