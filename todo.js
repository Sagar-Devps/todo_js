// DOM elements
const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const showCompleted = document.getElementById('showCompleted');
const clearCompleted = document.getElementById('clearCompleted');

// Retrieve tasks from local storage or initialize an empty array
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Check if there is a duplicate task using a callback function
const isDuplicateTask = (taskText) =>
  tasks.some((task) => task.text.toLowerCase() === taskText.toLowerCase() && !task.completed);

// Save the tasks to local storage
const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

// Function to render the tasks on the web page
const renderTasks = () => {
  // Filter tasks based on the "Show completed" checkbox
  const filteredTasks = showCompleted.checked ? tasks : tasks.filter((task) => !task.completed);
  
  // Clear the existing task list
  taskList.innerHTML = '';

  // Loop through the filtered tasks and create HTML elements for each task
  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement('tr');
    taskItem.innerHTML = `
      <td>
        <div class="form-check">
          <input type="checkbox" class="form-check-input complete-task" ${task.completed ? 'checked' : ''}>
          <label class="form-check-label ${task.completed ? 'completed' : ''}">${task.text}</label>
        </div>
      </td>
      <td class="actions">
        <button class="btn btn-sm btn-info edit-button" data-index="${index}"><i class="fas fa-edit"></i> Edit</button>
        <button class="btn btn-sm ${task.priority ? 'btn-warning' : 'btn-secondary'} priority-button" data-index="${index}"><i class="fas fa-star"></i> Priority</button>
        <button class="btn btn-sm btn-danger remove-button" data-index="${index}"><i class="fas fa-trash"></i> Remove</button>
      </td>
    `;

    // Attach event listener for task completion (for checkboxes)
    const completeCheckbox = taskItem.querySelector('.complete-task');
    completeCheckbox.addEventListener('change', () => {
      task.completed = completeCheckbox.checked;
    //   call saveTasks() and renderTasks() here for saving and rendering the tasks
      saveTasks();
      renderTasks();
    });

    // Attach event listeners for Edit, Priority, and Remove buttons
    const editButton = taskItem.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
      const newText = prompt('Edit task:', task.text);
      if (newText !== null) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    const priorityButton = taskItem.querySelector('.priority-button');
    priorityButton.addEventListener('click', () => {
        //  toggle the priority property of the task
      task.priority = !task.priority;
      saveTasks();
      renderTasks();
    });

    const removeButton = taskItem.querySelector('.remove-button');
    removeButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    // Append the task item to the task list
    taskList.appendChild(taskItem);
  });
};

// Add a task when the "Add Task" button is clicked
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (!taskText || isDuplicateTask(taskText)) {
    alert('Task already exists or is empty!');
    return;
  }

  // Create a new task object and push it to the tasks array
  tasks.push({ text: taskText, completed: false, priority: false });
  saveTasks();
  renderTasks();
  taskInput.value = ''; // Clear the input field
});

// Add a task when Enter is pressed in the input field
taskInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    addTaskBtn.click(); // Trigger a click event on the "Add Task" button
  }
});

// Show/hide completed tasks when the "Show completed" checkbox changes
showCompleted.addEventListener('change', renderTasks);

// Clear completed tasks when the "Clear Completed Tasks" button is clicked
clearCompleted.addEventListener('click', () => {
  // Remove completed tasks from the tasks array
  tasks.splice(0, tasks.length, ...tasks.filter((task) => !task.completed));
  saveTasks();
  renderTasks();
});

// Initial rendering of tasks
renderTasks();
