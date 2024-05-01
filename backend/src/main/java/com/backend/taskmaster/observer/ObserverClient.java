package com.backend.taskmaster.observer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.taskmaster.service.webSocket.WebSocketMessagingService;

@Service
public class ObserverClient implements TaskObserverInterface{
    
    @Autowired
    private WebSocketMessagingService messagingService;
    
    @Override
    public void onTaskCreated(String message) {
        messagingService.sendMessage("Notification: ", message);
    }

    @Override
    public void onTaskUpdated(String message) {
        messagingService.sendMessage("Notification: ", message);
    }

    @Override
    public void onTaskDeleted(String message) {
        messagingService.sendMessage("Notification: ", message);
    }

    @Override
    public void onTaskPriorityCreated(String message) {
        messagingService.sendMessage("Notification: ", message);
    }

    @Override
    public void onTaskMarkCompleted(String message) {
        messagingService.sendMessage("Notification: ", message);
    }
}
