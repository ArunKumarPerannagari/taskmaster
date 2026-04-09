/* ── Storage ────────────────────────────────────────────── */
const STORAGE_KEY = 'todo-app-tasks';

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allTasks));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ── State ──────────────────────────────────────────────── */
let allTasks = loadFromStorage();
let currentFilter = 'all';

/* ── DOM refs ───────────────────────────────────────────── */
const taskInput  = document.getElementById('task-input');
const addBtn     = document.getElementById('add-btn');
const addError   = document.getElementById('add-error');
const taskList   = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const emptyText  = document.getElementById('empty-text');
const clearBtn   = document.getElementById('clear-btn');
const statTotal  = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statDone   = document.getElementById('stat-done');
const dateLabel  = document.getElementById('current-date');
const progressBar = document.getElementById('progress-bar');

/* ── Date ───────────────────────────────────────────────── */
dateLabel.textContent = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

/* ── Error helper ───────────────────────────────────────── */
function showAddError(msg) {
  addError.textContent = msg;
  addError.classList.remove('hidden');
  setTimeout(() => addError.classList.add('hidden'), 3000);
}

/* ── Time helper ────────────────────────────────────────── */
function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 5)     return 'just now';
  if (diff < 60)    return diff + 's ago';
  if (diff < 3600)  return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

/* ── Stats + progress ───────────────────────────────────── */
function updateStats() {
  const total = allTasks.length;
  const done  = allTasks.filter(t => t.completed).length;
  statTotal.textContent  = total;
  statActive.textContent = total - done;
  statDone.textContent   = done;
  if (progressBar) {
    progressBar.style.width = total ? Math.round((done / total) * 100) + '%' : '0%';
  }
}

/* ── Filter ─────────────────────────────────────────────── */
function filteredTasks() {
  switch (currentFilter) {
    case 'active':    return allTasks.filter(t => !t.completed);
    case 'completed': return allTasks.filter(t => t.completed);
    case 'recent':
      return [...allTasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    default: return allTasks;
  }
}

/* ── Render ─────────────────────────────────────────────── */
function render() {
  updateStats();
  const tasks = filteredTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    const msgs = {
      all:       'No tasks yet. Add one above!',
      active:    'All done — nothing left to do! 🎉',
      completed: 'No completed tasks yet.',
      recent:    'No recent tasks.',
    };
    emptyText.textContent = msgs[currentFilter] || 'No tasks.';
  } else {
    emptyState.classList.add('hidden');
    tasks.forEach(t => taskList.appendChild(makeTaskEl(t)));
  }
}

/* ── Build task element ─────────────────────────────────── */
function makeTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  /* Checkbox */
  const cb = document.createElement('div');
  cb.className = 'cb' + (task.completed ? ' checked' : '');
  cb.addEventListener('click', () => toggleComplete(task.id));

  /* Body */
  const body = document.createElement('div');
  body.className = 'task-body';

  const textEl = document.createElement('span');
  textEl.className = 'task-text';
  textEl.textContent = task.text;

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  meta.textContent = timeAgo(task.createdAt);

  body.append(textEl, meta);

  /* Actions */
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = makeBtn('✏️', 'edit', () => startEdit(task.id, li, body, textEl, actions));
  const delBtn  = makeBtn('✕',  'del',  () => deleteTask(task.id));
  actions.append(editBtn, delBtn);

  li.append(cb, body, actions);
  return li;
}

function makeBtn(label, cls, onClick) {
  const b = document.createElement('button');
  b.className = `act-btn ${cls}`;
  b.textContent = label;
  b.addEventListener('click', onClick);
  return b;
}

/* ── Inline edit ────────────────────────────────────────── */
function startEdit(id, li, body, textEl, actions) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  const input = document.createElement('input');
  input.className = 'edit-input';
  input.value = task.text;
  body.replaceChild(input, textEl);
  input.focus();
  input.select();

  const saveBtn   = makeBtn('✓', 'save',   () => commitEdit(id, input.value, li, body, input, textEl, actions, saveBtn, cancelBtn));
  const cancelBtn = makeBtn('✕', 'cancel', () => cancelEdit(li, body, input, textEl, actions));

  actions.innerHTML = '';
  actions.append(saveBtn, cancelBtn);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  saveBtn.click();
    if (e.key === 'Escape') cancelBtn.click();
  });
}

function cancelEdit(li, body, input, textEl, actions) {
  body.replaceChild(textEl, input);
  actions.innerHTML = '';
  const task = allTasks.find(t => t.id == li.dataset.id);
  if (task) {
    const editBtn = makeBtn('✏️', 'edit', () => startEdit(task.id, li, body, textEl, actions));
    const delBtn  = makeBtn('✕',  'del',  () => deleteTask(task.id));
    actions.append(editBtn, delBtn);
  }
}

async function commitEdit(id, newText, li, body, input, textEl, actions, saveBtn, cancelBtn) {
  const trimmed = newText.trim();
  if (!trimmed) return;
  const task = allTasks.find(t => t.id === id);
  if (!task) return;

  task.text = trimmed;
  textEl.textContent = trimmed;
  saveTasks();
  cancelEdit(li, body, input, textEl, actions);

  try {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed }),
    });
  } catch { /* already saved locally */ }
}

/* ── Toggle complete ────────────────────────────────────── */
function toggleComplete(id) {
  const task = allTasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  render();

  fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: task.completed }),
  }).catch(() => {});
}

/* ── Add task ───────────────────────────────────────────── */
async function addTask() {
  const text = taskInput.value.trim();
  if (!text) { showAddError('Please enter a task.'); taskInput.focus(); return; }

  const tempId = 'tmp_' + Date.now();
  const tempTask = { id: tempId, text, completed: false, createdAt: new Date().toISOString() };

  allTasks.unshift(tempTask);
  saveTasks();
  taskInput.value = '';
  render();

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const saved = await res.json();
      const idx = allTasks.findIndex(t => t.id === tempId);
      if (idx !== -1) allTasks[idx] = saved;
      saveTasks();
    }
  } catch { /* keep local version */ }
}

/* ── Delete task ────────────────────────────────────────── */
async function deleteTask(id) {
  allTasks = allTasks.filter(t => t.id !== id);
  saveTasks();
  render();

  try { await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); } catch {}
}

/* ── Clear completed ────────────────────────────────────── */
async function clearCompleted() {
  const toDelete = allTasks.filter(t => t.completed);
  allTasks = allTasks.filter(t => !t.completed);
  saveTasks();
  render();
  toDelete.forEach(t => fetch(`/api/tasks/${t.id}`, { method: 'DELETE' }).catch(() => {}));
}

/* ── Tabs ───────────────────────────────────────────────── */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    render();
  });
});

/* ── Events ─────────────────────────────────────────────── */
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
clearBtn.addEventListener('click', clearCompleted);

/* ── Init: load from localStorage first, then sync server ── */
render();

fetch('/api/tasks')
  .then(r => r.ok ? r.json() : null)
  .then(serverTasks => {
    if (serverTasks && serverTasks.length > 0) {
      /* Merge: server is source of truth for IDs, keep local completion state */
      const localMap = {};
      allTasks.forEach(t => { localMap[t.id] = t; });
      serverTasks.forEach(st => {
        if (!localMap[st.id]) allTasks.push(st);
      });
      saveTasks();
      render();
    }
  })
  .catch(() => { /* offline — use localStorage */ });
