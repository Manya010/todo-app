package com.example.todo_app.controller;

import com.example.todo_app.model.Task;
import com.example.todo_app.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository repo;

    // Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    // Create a new task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return repo.save(task);
    }

    // Update task (mark as completed or edit content)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Task existingTask = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));

        // Update content if provided
        if (updatedTask.getContent() != null && !updatedTask.getContent().trim().isEmpty()) {
            existingTask.setContent(updatedTask.getContent());
        }

        // Update completed status
        existingTask.setCompleted(updatedTask.isCompleted());

        return repo.save(existingTask);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
