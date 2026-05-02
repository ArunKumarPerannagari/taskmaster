import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext(null);

const DEMO_TASKS = [
  {
    id: uuidv4(), title: 'Design new landing page', description: 'Create wireframes and mockups for the new product landing page.',
    priority: 'high', category: 'Work', tags: ['design', 'ui'], completed: false,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(), status: 'todo'
  },
  {
    id: uuidv4(), title: 'Review quarterly report', description: 'Analyze Q4 metrics and prepare summary for stakeholders.',
    priority: 'high', category: 'Work', tags: ['finance', 'report'], completed: false,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'inprogress'
  },
  {
    id: uuidv4(), title: 'Morning workout routine', description: '30 minutes cardio + strength training.',
    priority: 'medium', category: 'Health', tags: ['fitness'], completed: true,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date().toISOString(), status: 'done'
  },
  {
    id: uuidv4(), title: 'Read "Atomic Habits"', description: 'Read chapters 5-8 and take notes.',
    priority: 'low', category: 'Learning', tags: ['books', 'self-improvement'], completed: false,
    dueDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 259200000).toISOString(), status: 'todo'
  },
  {
    id: uuidv4(), title: 'Buy groceries', description: 'Milk, eggs, bread, vegetables, fruits.',
    priority: 'medium', category: 'Shopping', tags: ['errands'], completed: true,
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    completedAt: new Date().toISOString(), status: 'done'
  },
  {
    id: uuidv4(), title: 'Team standup meeting', description: 'Daily sync with the engineering team.',
    priority: 'medium', category: 'Work', tags: ['meeting'], completed: false,
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'todo'
  },
  {
    id: uuidv4(), title: 'Pay electricity bill', description: 'Online payment before due date.',
    priority: 'high', category: 'Finance', tags: ['bills'], completed: false,
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 432000000).toISOString(), status: 'todo'
  },
  {
    id: uuidv4(), title: 'Plan weekend trip', description: 'Research hotels and activities for Goa trip.',
    priority: 'low', category: 'Travel', tags: ['vacation', 'planning'], completed: false,
    dueDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 518400000).toISOString(), status: 'todo'
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('taskmaster_tasks', DEMO_TASKS);
  const [filters, setFilters] = useState({
    search: '', priority: 'all', category: 'all', status: 'all', view: 'all'
  });
  const [sortBy, setSortBy] = useState('created');
  const [toasts, setToasts] = useState([]);

  // ---- Toast helpers ----
  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ---- Task CRUD ----
  const addTask = useCallback((taskData) => {
    const newTask = {
      id: uuidv4(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      status: 'todo',
    };
    setTasks(prev => [newTask, ...prev]);
    addToast({ type: 'success', title: 'Task Created!', message: `"${taskData.title}" has been added.` });
    return newTask;
  }, [setTasks, addToast]);

  const editTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addToast({ type: 'info', title: 'Task Updated', message: 'Your changes have been saved.' });
  }, [setTasks, addToast]);

  const deleteTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast({ type: 'error', title: 'Task Deleted', message: `"${task?.title}" was removed.` });
  }, [tasks, setTasks, addToast]);

  const toggleComplete = useCallback((id) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completed = !t.completed;
      return {
        ...t,
        completed,
        status: completed ? 'done' : 'todo',
        completedAt: completed ? new Date().toISOString() : null,
      };
    }));
  }, [setTasks]);

  const reorderTasks = useCallback((newTasks) => {
    setTasks(newTasks);
  }, [setTasks]);

  const updateTaskStatus = useCallback((id, status) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const completed = status === 'done';
      return { ...t, status, completed, completedAt: completed ? new Date().toISOString() : null };
    }));
  }, [setTasks]);

  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => !t.completed));
    addToast({ type: 'info', title: 'Cleared', message: 'All completed tasks have been removed.' });
  }, [setTasks, addToast]);

  const value = {
    tasks,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    toasts,
    addToast,
    removeToast,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    updateTaskStatus,
    clearCompleted,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
