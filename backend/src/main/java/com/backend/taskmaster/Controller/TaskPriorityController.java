package com.backend.taskmaster.Controller;

import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.taskmaster.common.request.TaskPriorityRequest;
import com.backend.taskmaster.model.TaskPriority;
import com.backend.taskmaster.service.TaskPriorityService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/task-priority")
@RequiredArgsConstructor
public class TaskPriorityController {
    private final TaskPriorityService taskPriorityService;
    
    @PostMapping()
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<TaskPriority> addCategory(
        @Valid @RequestBody TaskPriorityRequest taskPriorityRequestRequest, 
        Principal principal) {
        return new ResponseEntity<>(
            taskPriorityService.addTaskPriority(
                taskPriorityRequestRequest, principal.getName()), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<TaskPriority> readTaskPriorityById(@PathVariable long id, 
        Principal principal) {
        return new ResponseEntity<>(taskPriorityService.readById(
            id, principal.getName()), HttpStatus.OK);
    }

    @GetMapping()
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<List<TaskPriority>> readAllTaskPriority(Principal principal){
        return new ResponseEntity<>(taskPriorityService.readAll(principal.getName()), HttpStatus.OK);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Object> deleteTaskPriority(@PathVariable long id, Principal principal) {
        taskPriorityService.deleteById(id, principal.getName());
        return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
    }
}
