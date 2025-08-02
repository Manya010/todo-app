// Fetch and display all tasks
async function fetchTasks() {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;

        checkbox.addEventListener('change', async () => {
            await fetch(`/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: task.content,
                    completed: checkbox.checked
                })
            });

            // Show toast message
            showToast(checkbox.checked ? '✅ Task completed!' : '❌ Task incomplete!');

            fetchTasks();
        });

        const span = document.createElement('span');
        span.textContent = task.content;
        if (task.completed) span.classList.add('completed');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', async () => {
            const newContent = prompt("Edit task:", task.content);
            if (newContent !== null && newContent.trim() !== '') {
                await fetch(`/api/tasks/${task.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: newContent.trim(),
                        completed: task.completed
                    })
                });
                fetchTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', async () => {
            li.classList.add('fade-out');
            setTimeout(async () => {
                await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
                fetchTasks();
            }, 300);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// Add a new task
async function addTask() {
    const input = document.getElementById('taskInput');
    const content = input.value.trim();
    if (!content) return;

    await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, completed: false })
    });

    input.value = '';
    showToast('🎉 Task added!');
    fetchTasks();
}

// Show toast notifications
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 2000);
}

// Initial fetch
fetchTasks();
