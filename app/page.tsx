'use client';
import TaskItem from '@/components/TaskItem';
import { Task } from '@/types/task';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  // Fetch tasks on load
  const loadTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };
  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!newTask.trim()) {
      setError('Title cannot be empty');
      return;
    }

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });
    const created = await res.json();
    if (!res.ok) return setError(created.error);

    setTasks((prev) => [...prev, created]);
    setNewTask('');
    setError('');
  };

  // Toggle done
  const toggleDone = async (id: string, done: boolean) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done }),
    });
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
  };

  // Delete task
  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TODO List</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleDone}
            onDelete={deleteTask}
          />
        ))}
      </ul>
    </main>
  );
}
