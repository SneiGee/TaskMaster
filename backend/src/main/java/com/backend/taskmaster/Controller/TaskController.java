package com.backend.taskmaster.Controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.taskmaster.common.request.TaskRequest;
import com.backend.taskmaster.common.response.CountResponse;
import com.backend.taskmaster.model.Task;
import com.backend.taskmaster.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/task")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;

	@PostMapping()
	@ResponseStatus(HttpStatus.CREATED)
	public ResponseEntity<Task> create(
        @Valid @RequestBody TaskRequest taskCreateRequest, 
        Principal principal) {
		return new ResponseEntity<>(taskService.create(
            taskCreateRequest, principal.getName()), HttpStatus.CREATED);
	}
	
	@GetMapping()
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<List<Task>> readAll(
        Principal principal, 
        @RequestParam(required = false) String isCompleted){
		if(isCompleted != null) {
			return new ResponseEntity<>(taskService.readAllByIsCompleted(principal.getName(), 
            isCompleted), HttpStatus.OK);
		}
		return new ResponseEntity<>(taskService.readAllTasks(principal.getName()), HttpStatus.OK);
	}
	
	@GetMapping("/count")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<CountResponse> countAll(
        Principal principal, 
        @RequestParam(required = false) String isCompleted){
		if(isCompleted != null) {
			return new ResponseEntity<>(taskService.countAllByIsCompleted(principal.getName(), 
                isCompleted), HttpStatus.OK);
		}
		return new ResponseEntity<>(taskService.countAll(principal.getName()), HttpStatus.OK);
	}

	@GetMapping("/{pageNumber}/{pageSize}")
    @ResponseStatus(HttpStatus.OK)
	public ResponseEntity<List<Task>> readAllPageable(
        Principal principal, @PathVariable String pageNumber, 
        @PathVariable String pageSize, @RequestParam(required = false) String isCompleted){
		if(isCompleted != null) {
			return new ResponseEntity<>(taskService.readAllByIsCompletedPageable(
                principal.getName(), isCompleted, pageNumber, pageSize), HttpStatus.OK);
		}
		return new ResponseEntity<>(taskService.readAllPageable(
            principal.getName(), pageNumber, pageSize), HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Task> read(@PathVariable long id, Principal principal) {
		return new ResponseEntity<>(taskService.readTaskById(id, principal.getName()), 
            HttpStatus.OK);
	}
	
	@PutMapping("/{id}/markcomplete")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Task> markComplete(@PathVariable long id, Principal principal) {
		return new ResponseEntity<>(taskService.markCompleteById(
            id, principal.getName()), HttpStatus.OK);
	}
	
	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Task> update(@PathVariable long id, 
        @Valid @RequestBody TaskRequest todoUpdateRequest, Principal principal) {
		return new ResponseEntity<>(taskService.updateById(id, todoUpdateRequest, principal.getName()), HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<Object> delete(@PathVariable long id, Principal principal) {
		taskService.deleteById(id, principal.getName());
		return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
	}

	@PutMapping("/{id}/addTaskPriority")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<Task> addPriorityToTask(
        @PathVariable long id, @RequestBody long categoryId, Principal principal) {
		return new ResponseEntity<>(taskService.addTaskPriorityToTask(
            id, categoryId, principal.getName()), HttpStatus.OK);
	}

	@GetMapping("/task-priority/{taskPriorityId}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<List<Task>> readAllByTaskPriorityId(
        @PathVariable long taskPriorityId, Principal principal) {
		return new ResponseEntity<>(taskService.readByTaskPriorityId(
            taskPriorityId, principal.getName()), HttpStatus.OK);
	}

}
