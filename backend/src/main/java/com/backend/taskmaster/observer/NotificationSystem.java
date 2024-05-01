package com.backend.taskmaster.observer;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class NotificationSystem {
    private List<TaskObserverInterface> observers = new ArrayList<>();

    public void addObserver(TaskObserverInterface observer) {
        observers.add(observer);
    }

    public void removeObserver(TaskObserverInterface observer) {
        observers.remove(observer);
    }

    public void createTask(String taskName) {

        // Notify all observers about the new task creation
        notifyObservers("Task has been created: " + taskName);
    }

    public void updateTask() {
        notifyObservers("Task updated");
    }

    public void deleteTask() {
        notifyObservers("Task deleted");
    }

    public void createTaskPriority() {
        notifyObservers("Task Priority created");
    }

    public void markAsComplete(String taskName) {
        notifyObservers("Task : " + taskName + " completed");
    }

    private void notifyObservers(String message) {
        for (TaskObserverInterface observer : observers) {
            observer.onTaskCreated(message);
            observer.onTaskPriorityCreated(message);
            observer.onTaskDeleted(message);
            observer.onTaskUpdated(message);
            observer.onTaskMarkCompleted(message);
        }
    }
}
