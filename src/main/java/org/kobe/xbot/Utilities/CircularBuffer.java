package org.kobe.xbot.Utilities;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.BiFunction;

public class CircularBuffer<T> {
    private final Object[] buffer;
    private int writeIndex = 0;
    public int size = 0; // Tracks the current size of the buffer
    private final int capacity;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final BiFunction<T, T, Boolean> shouldRemove;

    // Constructor to initialize the buffer with a specific size and removal function
    public CircularBuffer(int capacity, BiFunction<T, T, Boolean> shouldRemove) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Buffer size must be greater than 0");
        }
        this.capacity = capacity;
        this.buffer = new Object[capacity];
        this.shouldRemove = shouldRemove;
    }
    public CircularBuffer(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Buffer size must be greater than 0");
        }
        this.capacity = capacity;
        this.buffer = new Object[capacity];
        this.shouldRemove = null;
    }


    // Write data to the buffer
    public void write(T data) {
        lock.lock();
        try {
            buffer[writeIndex] = data;
            writeIndex = (writeIndex + 1) % capacity;
            if (size < capacity) {
                size++;
            }
            notEmpty.signalAll();
        } finally {
            lock.unlock();
        }
    }

    public T readAndBlock() {
        lock.lock();
        try {
            while (size == 0) {
                notEmpty.await(); // Wait until the buffer is not empty
            }
            // Read the data in FIFO order
            int readIndex = (writeIndex - size + capacity) % capacity;
            T data = (T) buffer[readIndex];
            buffer[readIndex] = null; // Clear the read slot
            size--;
            return data;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupt status
            throw new RuntimeException("Thread interrupted while waiting for data", e);
        } finally {
            lock.unlock();
        }
    }

    public T read() {
        lock.lock();
        try {
            if (size == 0) {
                return null;
            }
            // Read the data in FIFO order
            int readIndex = (writeIndex - size + capacity) % capacity;
            T data = (T) buffer[readIndex];
            buffer[readIndex] = null;
            size--;
            return data;
        } finally {
            lock.unlock();
        }
    }

    // Read the latest data and clear the buffer based on the removal function
    public T readLatestAndClearOnFunction() {
        lock.lock();
        try {
            while (size == 0) {
                notEmpty.await(); // Wait until the buffer is not empty
            }
            int latestIndex = (writeIndex - 1 + capacity) % capacity;
            T latestData = (T) buffer[latestIndex];

            // Filter the buffer using the removal function
            int newSize = 0;
            int currentIndex = (writeIndex - size + capacity) % capacity;
            for (int i = 0; i < size; i++) {
                T currentData = (T) buffer[currentIndex];
                if (!shouldRemove.apply(latestData, currentData)) {
                    buffer[newSize] = currentData;
                    newSize++;
                }
                currentIndex = (currentIndex + 1) % capacity;
            }

            // Update buffer metadata
            size = newSize;
            writeIndex = newSize % capacity;

            return latestData;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupt status
            throw new RuntimeException("Thread interrupted while waiting for data", e);
        } finally {
            lock.unlock();
        }
    }


    // Optional: Check if the buffer is empty
    public boolean isEmpty() {
        lock.lock();
        try {
            return size == 0;
        } finally {
            lock.unlock();
        }
    }

    // Optional: Get the current size of the buffer
    public int getSize() {
        lock.lock();
        try {
            return size;
        } finally {
            lock.unlock();
        }
    }
}
