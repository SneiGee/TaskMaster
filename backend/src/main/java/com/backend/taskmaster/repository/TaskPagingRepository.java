package com.backend.taskmaster.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import com.backend.taskmaster.model.Task;

public interface TaskPagingRepository extends PagingAndSortingRepository<Task, Long> {
    List<Task> findAllByUsername(String username, Pageable pageable);
	List<Task> findAllByUsernameAndIsCompleted(String username, boolean isCompleted, Pageable pageable);
}
