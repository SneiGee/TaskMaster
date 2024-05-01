package com.backend.taskmaster.common.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotEmpty;

public class TaskPriorityRequest {
    @NotEmpty(message = "Title is required")
    @Column(unique = true)
    private String title;

    protected TaskPriorityRequest(){

    }

    public TaskPriorityRequest(String title){
        super();
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

}
