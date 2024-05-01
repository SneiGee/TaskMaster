package com.backend.taskmaster.service.webSocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketMessagingService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendMessage(String topic, String message) {
        messagingTemplate.convertAndSend("/topic" + topic, message);
    }
}
