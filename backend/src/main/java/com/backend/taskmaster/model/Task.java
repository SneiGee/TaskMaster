package com.backend.taskmaster.model;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
public class Task {
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@NotEmpty(message = "Title is required")
	private String title;

	private String description = "";

	@NotNull(message = "Due date is required")
	private LocalDate dueDate;
	
	private String username;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "taskPriority_id")
	@NotNull(message = "Task Priority is required")
	// @JsonIgnoreProperties("tasks")
	private TaskPriority taskPriority;
	
	private boolean isCompleted;
	
	protected Task() {
		
	}
	
	public Task(String title, String description, LocalDate dueDate, String username, TaskPriority taskPriority) {
		super();
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.username = username;
		this.taskPriority = taskPriority;
		this.isCompleted = false;
	}
	
	public long getId() {
		return id;
	}

	public void setIdd(long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public boolean getIsCompleted() {
		return isCompleted;
	}

	public void setIsCompleted(boolean isCompleted) {
		this.isCompleted = isCompleted;
	}

	@Override
	public String toString() {
		return "Todo [id=" + id + ", title=" + title + ", dueDate=" + dueDate + ", username=" + username
				+ ", isCompleted=" + isCompleted + "taskPriority=" + taskPriority + "]";
	}
}
