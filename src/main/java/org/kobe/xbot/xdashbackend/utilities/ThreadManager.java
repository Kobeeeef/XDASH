package org.kobe.xbot.xdashbackend.utilities;

import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

public class ThreadManager implements AutoCloseable {
    private ExecutorService executor;
    private final Map<String, List<TaskInfo>> tasks; // Task name to a list of TaskInfo objects
    private final int poolSize;   // Pool size (for thread count)
    private final int queueSize;  // Queue size

    public ThreadManager(int poolSize, int queueSize) {
        this.poolSize = poolSize;
        this.queueSize = queueSize;
        // Create a thread pool with a bounded queue and a rejection policy
        executor = new ThreadPoolExecutor(
                poolSize,                               // core pool size
                poolSize,                               // maximum pool size
                60L,                                    // keep-alive time for idle threads
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(queueSize),    // Bounded queue with specified capacity
                new ThreadPoolExecutor.CallerRunsPolicy()  // Rejection policy
        );
        tasks = new HashMap<>();
    }

    @Override
    public void close() {
        shutdownInstantly();
    }

    // Execute a task and associate it with a name and description
    public void execute(String name, String description, Runnable task) {
        TaskInfo taskInfo = new TaskInfo(name, description);
        tasks.computeIfAbsent(name, k -> new ArrayList<>()).add(taskInfo); // Add the TaskInfo to the list of tasks for this name

        executor.execute(() -> {
            try {
                task.run();
            } finally {
                tasks.get(name).remove(taskInfo); // Remove from the list after completion
                if (tasks.get(name).isEmpty()) {
                    tasks.remove(name); // Remove the entry if the list is empty
                }
            }
        });
    }

    // Submit a task and return a Future object
    public Future<?> submit(String name, String description, Runnable task) {
        TaskInfo taskInfo = new TaskInfo(name, description);
        tasks.computeIfAbsent(name, k -> new ArrayList<>()).add(taskInfo); // Add the TaskInfo to the list of tasks for this name

        return executor.submit(() -> {
            try {
                task.run();
            } finally {
                tasks.get(name).remove(taskInfo); // Remove from the list after completion
                if (tasks.get(name).isEmpty()) {
                    tasks.remove(name); // Remove the entry if the list is empty
                }
            }
        });
    }

    // Get all the tasks as TaskInfo objects
    public List<TaskInfo> getAll() {
        List<TaskInfo> allTasks = new ArrayList<>();
        for (List<TaskInfo> taskList : tasks.values()) {
            allTasks.addAll(taskList); // Flatten the task lists into a single list
        }
        return allTasks;
    }

    // Restart everything with a timeout and provide updates via a consumer
    public void restartEverything(Consumer<String> updates, int timeout) {
        try {
            updates.accept("Shutting down all tasks...");
            executor.shutdown();
            if (!executor.awaitTermination(timeout, TimeUnit.MILLISECONDS)) {
                executor.shutdownNow();
                if (!executor.awaitTermination(timeout, TimeUnit.MILLISECONDS)) {
                    updates.accept("Executor pool did not terminate in time.");
                }
            }
            updates.accept("All tasks terminated. Restarting executor pool...");
            // Recreate the executor with the same pool size and queue size
            executor = new ThreadPoolExecutor(
                    poolSize,                               // core pool size
                    poolSize,                               // maximum pool size
                    60L,                                    // keep-alive time for idle threads
                    TimeUnit.SECONDS,
                    new ArrayBlockingQueue<>(queueSize),    // Bounded queue with specified capacity
                    new ThreadPoolExecutor.CallerRunsPolicy()  // Rejection policy
            );
            updates.accept("Executor pool restarted.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            updates.accept("Error during restart: " + e.getMessage());
        }
    }

    public void shutdownInstantly() {
        try {
            executor.shutdownNow();  // Forcefully shutdown immediately
            if (!executor.awaitTermination(1, TimeUnit.SECONDS)) {
                System.err.println("Executor pool did not terminate in time.");
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Error during shutdown: " + e.getMessage());
        }
    }

    // Wait for all tasks to finish
    public void waitForAllToFinish() throws InterruptedException {
        executor.shutdown();
        // Wait for all tasks to complete
        if (!executor.awaitTermination(Long.MAX_VALUE, TimeUnit.SECONDS)) {
            System.err.println("Not all tasks finished in the expected time.");
        }
    }

    // TaskInfo holds task metadata like name and description
    public static class TaskInfo {
        String name;
        String description;

        TaskInfo(String name, String description) {
            this.name = name;
            this.description = description;
        }

        @Override
        public String toString() {
            return "Name: " + name + ", Description: " + description;
        }
    }
}
