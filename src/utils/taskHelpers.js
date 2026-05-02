import { format, isToday, isTomorrow, isPast, isThisWeek, parseISO } from 'date-fns';

// ============ FILTER / SEARCH ============
export const filterTasks = (tasks, { search, priority, category, status, view }) => {
  return tasks.filter(task => {
    const matchesSearch = !search ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase()) ||
      task.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority = !priority || priority === 'all' || task.priority === priority;
    const matchesCategory = !category || category === 'all' || task.category === category;

    const matchesStatus =
      !status || status === 'all' ||
      (status === 'completed' && task.completed) ||
      (status === 'pending' && !task.completed) ||
      (status === 'overdue' && isOverdue(task));

    const matchesView =
      !view || view === 'all' ||
      (view === 'today' && task.dueDate && isToday(parseISO(task.dueDate))) ||
      (view === 'week' && task.dueDate && isThisWeek(parseISO(task.dueDate)));

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus && matchesView;
  });
};

// ============ SORT ============
export const sortTasks = (tasks, sortBy) => {
  const sorted = [...tasks];
  switch (sortBy) {
    case 'date-asc':
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'date-desc':
      return sorted.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
    case 'priority':
      const ORDER = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => (ORDER[a.priority] ?? 3) - (ORDER[b.priority] ?? 3));
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      return sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
    case 'created':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// ============ DATE HELPERS ============
export const isOverdue = (task) => {
  if (!task.dueDate || task.completed) return false;
  return isPast(parseISO(task.dueDate + 'T23:59:59'));
};

export const formatDueDate = (dateStr) => {
  if (!dateStr) return null;
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
};

export const getDueDateColor = (task) => {
  if (!task.dueDate || task.completed) return 'var(--text-muted)';
  const date = parseISO(task.dueDate);
  if (isOverdue(task)) return 'var(--priority-high)';
  if (isToday(date)) return 'var(--accent-amber)';
  if (isTomorrow(date)) return 'var(--primary)';
  return 'var(--text-muted)';
};

// ============ STATS ============
export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.filter(t => !t.completed).length;
  const overdue = tasks.filter(t => isOverdue(t)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, pending, overdue, percent };
};

export const getWeeklyData = (tasks) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.map((day, i) => {
    const created = tasks.filter(t => {
      const d = new Date(t.createdAt);
      return d.getDay() === i;
    }).length;
    const done = tasks.filter(t => {
      if (!t.completedAt) return false;
      const d = new Date(t.completedAt);
      return d.getDay() === i;
    }).length;
    return { day, created, done };
  });
};

export const getCategoryStats = (tasks) => {
  const map = {};
  tasks.forEach(t => {
    const cat = t.category || 'Uncategorized';
    if (!map[cat]) map[cat] = { total: 0, completed: 0 };
    map[cat].total++;
    if (t.completed) map[cat].completed++;
  });
  return Object.entries(map).map(([name, data]) => ({
    name,
    ...data,
    percent: data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100),
  }));
};

// ============ CATEGORIES ============
export const DEFAULT_CATEGORIES = [
  'Work', 'Personal', 'Health', 'Shopping', 'Learning', 'Finance', 'Travel', 'Other'
];

export const CATEGORY_COLORS = {
  Work: '#6366f1',
  Personal: '#10b981',
  Health: '#f43f5e',
  Shopping: '#f59e0b',
  Learning: '#06b6d4',
  Finance: '#a855f7',
  Travel: '#ec4899',
  Other: '#64748b',
  Uncategorized: '#94a3b8',
};

export const getCategoryColor = (category) =>
  CATEGORY_COLORS[category] || '#6366f1';
