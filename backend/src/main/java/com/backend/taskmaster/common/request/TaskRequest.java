package com.backend.taskmaster.common.request;

import java.time.LocalDate;
import com.backend.taskmaster.model.TaskPriority;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class TaskRequest {
    @NotEmpty(message = "Title is required")
	private String title;

	private String description;

	@NotNull(message = "Due date is required")
	private LocalDate dueDate;

    @NotNull(message = "Task Priority is required")
	private TaskPriority taskPriority;
	
	protected TaskRequest() {
		
	}

	public TaskRequest(String title, String description, LocalDate dueDate, TaskPriority taskPriority) {
		super();
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.taskPriority = taskPriority;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public TaskPriority getTaskPriority() {
		return taskPriority;
	}

	public void setTaskPriority(TaskPriority taskPriority) {
		this.taskPriority = taskPriority;
	}
}
