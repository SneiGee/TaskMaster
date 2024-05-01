package com.backend.taskmaster.service;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.taskmaster.common.request.TaskPriorityRequest;
import com.backend.taskmaster.model.TaskPriority;
import com.backend.taskmaster.observer.NotificationSystem;
import com.backend.taskmaster.repository.TaskPriorityRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskPriorityService {

    private NotificationSystem notificationSystem;
    private final TaskPriorityRepository taskPriorityRepository;
    
    public TaskPriority addTaskPriority(TaskPriorityRequest taskPriorityRequest, 
        String username) {

        TaskPriority taskPriority =  taskPriorityRepository.findByTitleAndUsername(
            taskPriorityRequest.getTitle(), username);
        if(taskPriority != null) {
            log.error("Task priority creation failed: already exists for user {}", username);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "This task priority already exists for " + username);
        }
        
        TaskPriority newTaskPriority = new TaskPriority(username, taskPriorityRequest.getTitle());
        notificationSystem.createTaskPriority(); 
        TaskPriority savedTaskPriority = taskPriorityRepository.save(newTaskPriority);
        log.info("New task priority created: {}", savedTaskPriority.getTitle());

        return savedTaskPriority;
    }

    
    public TaskPriority readById(long id, String username){
        TaskPriority taskPriority = taskPriorityRepository.findByUsernameAndTaskPriorityId(username, id);
        if(taskPriority == null){
            log.error("Task priority not found with ID {}", id);
            throw new EntityNotFoundException("Task Priority not found with ID: " + id);
        }
        return taskPriority;
    }
    
    public List<TaskPriority> readAll(String username){
        return taskPriorityRepository.findAllByUsername(username);
    }
    
    public void deleteById(Long id, String username) {
        TaskPriority taskPriority = taskPriorityRepository.findByUsernameAndTaskPriorityId(username, id);
        taskPriorityRepository.deleteById(id);
    }
}
