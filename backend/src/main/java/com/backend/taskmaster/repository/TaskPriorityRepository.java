package com.backend.taskmaster.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.taskmaster.model.TaskPriority;

public interface TaskPriorityRepository extends JpaRepository<TaskPriority, Long> {
    List<TaskPriority> findAllByUsername(String username);
    TaskPriority findTaskPriorityByTaskPriorityId(Long id);
    TaskPriority deleteTaskPriorityByTaskPriorityId(Long id);
    TaskPriority findByUsernameAndTaskPriorityId(String username, long id);

    TaskPriority findByTitleAndUsername(String TaskPriorityTitle, String username);

    TaskPriority findByTitle(String TaskPriorityTitle);
}
