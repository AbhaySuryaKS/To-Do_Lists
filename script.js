document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addButton');
    const resetButton = document.getElementById('resetButton');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const taskInput = document.getElementById('taskInput');
    const taskContainer = document.getElementById('taskContainer');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const popupMessage = document.getElementById('popupMessage');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    let tasks = [];

    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskContainer.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.done ? 'done' : ''}`;
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="done-button">${task.done ? 'Undo Done' : 'Done'}</button>
                    <button class="delete-button">Delete</button>
                </div>
            `;

            const doneButton = taskItem.querySelector('.done-button');
            const deleteButton = taskItem.querySelector('.delete-button');

            doneButton.addEventListener('click', () => {
                task.done = !task.done;
                task.timestamp = task.done ? new Date().toLocaleTimeString() : null;
                saveTasks();
                renderTasks();
            });

            deleteButton.addEventListener('click', () => {
                showPopup('Are you sure you want to delete this task?', () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });
            });

            taskContainer.appendChild(taskItem);
        });
    }

    function showPopup(message, onConfirm) {
        popupMessage.textContent = message;
        confirmationPopup.style.display = 'block';
        confirmButton.onclick = () => {
            confirmationPopup.style.display = 'none';
            onConfirm();
        };
        cancelButton.onclick = () => {
            confirmationPopup.style.display = 'none';
        };
    }

    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, done: false, timestamp: null });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    });

    resetButton.addEventListener('click', () => {
        taskInput.value = '';
    });

    deleteAllButton.addEventListener('click', () => {
        showPopup('Are you sure you want to delete all tasks?', () => {
            tasks = [];
            saveTasks();
            renderTasks();
        });
    });

    // Initial load of tasks
    loadTasks();
    renderTasks();
});
