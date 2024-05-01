package com.backend.taskmaster.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.taskmaster.model.Task;
import com.backend.taskmaster.model.TaskPriority;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
	List<Task> findAllByUsername(String username);
	List<Task> findAllByUsernameAndIsCompleted(String username, boolean isCompleted);
	List<Task> findAllByTaskPriorityAndUsername(Optional<TaskPriority> taskPriority, String username);
	Task findByUsernameAndId(String username, long Id);
	Long countByUsername(String username);
	Long countByUsernameAndIsCompleted(String username, boolean isCompleted);
}
