localStorage.removeItem('tasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';
let nextId = 
tasks.length > 0
? Math.max(...tasks.map(task => task.id)) + 1
: 1;

const labels = { high: '高', medium: '普通', low: '低' };

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const d = new Date();
document.getElementById('date-label').textContent =
d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';

function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function render() {
  const list = document.getElementById('task-list');
  let filtered = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done')   return  t.done;
    if (filter === 'high')   return  t.priority === 'high';
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty"><span class="empty-icon">📭</span>タスクがありません</div>`;
  } else {
    list.innerHTML = filtered.map(t => `
      <div class="task ${t.done ? 'done' : ''}">
        <button type="button" class="check-btn ${t.done ? 'checked' : ''}"
        onclick="toggle(${t.id})"
        aria-label="${t.done ? '未完了に戻す' : '完了にする'}">
        </button>
        <span class="task-text">${escHtml(t.text)}</span>
        <span class="badge ${t.priority}">${labels[t.priority]}</span>
        <button type="button" class="del-btn" onclick="remove(${t.id})" aria-label="削除">✕</button>
      </div>
    `).join('');
  }

  const done  = tasks.filter(t => t.done).length;
  const total = tasks.length;
  document.getElementById('stat-total').textContent  = total;
  document.getElementById('stat-done').textContent   = done;
  document.getElementById('stat-remain').textContent = total - done;
  document.getElementById('progress').style.width    =
    total ? Math.round(done / total * 100) + '%' : '0%';
}

function addTask() {
  const inp  = document.getElementById('task-input');
  const text = inp.value.trim();
  if (!text) { inp.focus(); return; }
  const priority = document.getElementById('priority-select').value;
  tasks.unshift({ id: nextId++, text, priority, done: 
  false });

  saveTasks();
  inp.value = '';
  inp.focus();
  render();
}

function toggle(id) {
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.done = !t.done;
    saveTasks();
  } 
  render();
}

function remove(id) {
  tasks = tasks.filter(x => x.id !== id);

  saveTasks();
  render();
}

function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

document.getElementById('task-input')
.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

render();
