// Export tasks as JSON file download
export const exportTasksAsJSON = (tasks) => {
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskmaster-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export tasks as CSV
export const exportTasksAsCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Priority', 'Category', 'Status', 'Due Date', 'Tags', 'Created At'];
  const rows = tasks.map(t => [
    `"${t.title}"`,
    `"${t.description || ''}"`,
    t.priority,
    t.category || '',
    t.completed ? 'Completed' : 'Pending',
    t.dueDate || '',
    (t.tags || []).join('; '),
    new Date(t.createdAt).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `taskmaster-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
