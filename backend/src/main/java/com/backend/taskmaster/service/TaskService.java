package com.backend.taskmaster.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.taskmaster.common.request.TaskRequest;
import com.backend.taskmaster.common.response.CountResponse;
import com.backend.taskmaster.exceptions.InvalidPageException;
import com.backend.taskmaster.model.Task;
import com.backend.taskmaster.model.TaskPriority;
import com.backend.taskmaster.observer.NotificationSystem;
import com.backend.taskmaster.repository.TaskPagingRepository;
import com.backend.taskmaster.repository.TaskPriorityRepository;
import com.backend.taskmaster.repository.TaskRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {
    
    private final NotificationSystem notificationSystem;
    private final TaskRepository taskRepository;
    private final TaskPriorityRepository taskPriorityRepository;
    private final TaskPagingRepository taskPagingRepository;

    public Task create(TaskRequest taskRequest, String username) {
		Task task = new Task(
            taskRequest.getTitle(), 
            taskRequest.getDescription(), 
            taskRequest.getDueDate(), 
            username,taskRequest.getTaskPriority());
		notificationSystem.createTask(taskRequest.getTitle());
        Task saveTask = taskRepository.save(task);
        log.info("New task created: {}", saveTask.getTitle());
        //task.setTaskPriority(taskRequest.getTaskPriority());
		return saveTask;
	}

	public Task addTaskPriorityToTask(Long taskId, Long taskPriorityId, String username) {
		Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new EntityNotFoundException("Task not found"));

		TaskPriority taskPriority = taskPriorityRepository.findById(taskPriorityId)
            .orElseThrow(() -> new EntityNotFoundException("Task Priority not found"));

        // category.getTodos().add(todo);
        // category.setTodos(category.getTodos());

		task.setTaskPriority(taskPriority);
		return taskRepository.save(task);
	}

	public Task readTaskById(long id, String username) {
		Task task = taskRepository.findByUsernameAndId(username, id);
		if(task == null) {
            log.error("Oops! Task not found");
			throw new EntityNotFoundException("TaskService not found");
		}
		return task;
	}

	public List<Task> readAllTasks(String username) {
		return taskRepository.findAllByUsername(username);
	}

    public List<Task> readAllByIsCompleted(String username, String isCompleted) {
		boolean _isCompleted = isCompletedStringToBoolean(isCompleted);
		return taskRepository.findAllByUsernameAndIsCompleted(username, _isCompleted);
	}

	public List<Task> readAllPageable(String username, String pageNumber, String pageSize) {
		int _pageNumber = pageNumberStringToInteger(pageNumber);
		int _pageSize = pageSizeStringToInteger(pageSize);
		
		Pageable pageable = PageRequest.of(_pageNumber, _pageSize, 
            Sort.by(Sort.Direction.ASC, "dueDate"));
		return taskPagingRepository.findAllByUsername(username, pageable);
	}

	public List<Task> readAllByIsCompletedPageable(String username, 
        String isCompleted, String pageNumber, String pageSize) {

		boolean _isCompleted = isCompletedStringToBoolean(isCompleted);
		int _pageNumber = pageNumberStringToInteger(pageNumber);
		int _pageSize = pageSizeStringToInteger(pageSize);
		
		Pageable pageable = PageRequest.of(_pageNumber, _pageSize, 
            Sort.by(Sort.Direction.ASC, "dueDate"));
		return taskPagingRepository.findAllByUsernameAndIsCompleted(
            username, _isCompleted, pageable);
	}

	public void deleteById(long id, String username) {
		Task task = taskRepository.findByUsernameAndId(username, id);
		if(task == null) {
            log.error("Oops! Task service not found");
			throw new EntityNotFoundException("Task Service not found");
		}
		notificationSystem.deleteTask();
		taskRepository.deleteById(id);
        log.info("Oops! Successfully delete Task!");
	}

	public Task updateById(long id, TaskRequest taskUpdateRequest, String username) {
		Task task = taskRepository.findByUsernameAndId(username, id);
		if(task == null) {
            log.error("Oops! Task not found with ID: " + id);
			throw new EntityNotFoundException("Task not found with ID: " + id);
		}
		
		task.setTitle(taskUpdateRequest.getTitle());
		task.setDescription(taskUpdateRequest.getDescription());
		task.setDueDate(taskUpdateRequest.getDueDate());
		task.setTaskPriority(taskUpdateRequest.getTaskPriority());
		notificationSystem.updateTask();
		return taskRepository.save(task);
	}

	public Task markCompleteById(long id, String username) {
		Task task = taskRepository.findByUsernameAndId(username, id);
		if(task == null) {
            log.error("Oops! Task service not found");
			throw new EntityNotFoundException("Task Service not found");
		}
		
		task.setIsCompleted(!task.getIsCompleted());
		notificationSystem.markAsComplete(task.getTitle());
		return taskRepository.save(task);
	}

	public CountResponse countAll(String username) {
		return new CountResponse(taskRepository.countByUsername(username));
	}

	public CountResponse countAllByIsCompleted(String username, String isCompleted) {
		boolean _isCompleted = isCompletedStringToBoolean(isCompleted);
		return new CountResponse(taskRepository.countByUsernameAndIsCompleted(
            username, _isCompleted));
	}

	public List<Task> readByTaskPriorityId(Long taskPriorityId, String username){
		List<Task> tasks = taskRepository.findAllByTaskPriorityAndUsername(
            taskPriorityRepository.findById(taskPriorityId), username);
		return tasks;
	}

	private boolean isCompletedStringToBoolean(String isCompleted) {
		try {
			return Boolean.parseBoolean(isCompleted);  
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid isCompleted");
		}
	}
    
	private int pageNumberStringToInteger(String pageNumber) {
		int _pageNumber;
		
		try {
			_pageNumber = Integer.parseInt(pageNumber);
		} catch(Exception e) {
			throw new InvalidPageException("Invalid Page Number");
		}
		
		if(_pageNumber < 0) {
			throw new InvalidPageException("Invalid page number");
		}
		
		return _pageNumber;
	}
	
	private int pageSizeStringToInteger(String pageSize) {
		int _pageSize;
		
		try {
			_pageSize = Integer.parseInt(pageSize);
		} catch(Exception e) {
			throw new InvalidPageException("Invalid Page Size");
		}
		
		if(_pageSize < 1) {
			throw new InvalidPageException("Invalid page size");
		}
		
		return _pageSize;
	}
}
