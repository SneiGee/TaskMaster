package com.backend.taskmaster.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotEmpty;

@Entity
public class TaskPriority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskPriorityId;

    private String username;

    @NotEmpty(message = "Title is required")
    private String title;

    @OneToMany(mappedBy = "taskPriority", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Task> tasks = new HashSet<>();

    public TaskPriority() {

    }

    public TaskPriority(String username, String title) {
        this.username = username;
        this.title = title;
    }

    public Long getId() {
        return taskPriorityId;
    }

    public void setId(Long taskPriorityId) {
        this.taskPriorityId = taskPriorityId;
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

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }
}
