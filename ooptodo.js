// Task class to represent individual tasks
function Task(text, completed = false, priority = false) {
    this.text = text;
    this.completed = completed;
    this.priority = priority;
  }
  
  // TaskManager class to manage tasks
  function TaskManager() {
    // Retrieve tasks from local storage or initialize an empty array
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }
  
  // Method to check if there is a duplicate task
  TaskManager.prototype.isDuplicateTask = function (taskText) {
    return this.tasks.some(
      (task) => task.text.toLowerCase() === taskText.toLowerCase() && !task.completed
    );
  };
  
  // Method to save the tasks to local storage
  TaskManager.prototype.saveTasks = function () {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  };
  
  // Method to render the tasks on the web page
  TaskManager.prototype.renderTasks = function () {
    const taskList = document.getElementById('taskList');
    const showCompleted = document.getElementById('showCompleted');
  
    // Filter tasks based on the "Show completed" checkbox
    const filteredTasks = showCompleted.checked
      ? this.tasks
      : this.tasks.filter((task) => !task.completed);
  
    // Clear the existing task list
    taskList.innerHTML = '';
  
    // Loop through the filtered tasks and create HTML elements for each task
    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement('tr');
      taskItem.innerHTML = `
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input complete-task" ${
              task.completed ? 'checked' : ''
            }>
            <label class="form-check-label ${task.completed ? 'completed' : ''}">${
        task.text
      }</label>
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
        this.saveTasks();
        this.renderTasks();
      });
  
      // Attach event listeners for Edit, Priority, and Remove buttons
      const editButton = taskItem.querySelector('.edit-button');
      editButton.addEventListener('click', () => {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null) {
          task.text = newText.trim();
          this.saveTasks();
          this.renderTasks();
        }
      });
  
      const priorityButton = taskItem.querySelector('.priority-button');
      priorityButton.addEventListener('click', () => {
        task.priority = !task.priority;
        this.saveTasks();
        this.renderTasks();
      });
  
      const removeButton = taskItem.querySelector('.remove-button');
      removeButton.addEventListener('click', () => {
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.renderTasks();
      });
  
      // Append the task item to the task list
      taskList.appendChild(taskItem);
    });
  };
  
  // Method to add a task
  TaskManager.prototype.addTask = function (taskText) {
    if (!taskText || this.isDuplicateTask(taskText)) {
      alert('Task already exists or is empty!');
      return;
    }
  
    // Create a new task object and push it to the tasks array
    this.tasks.push(new Task(taskText));
    this.saveTasks();
    this.renderTasks();
  };
  
  // Method to clear completed tasks
  TaskManager.prototype.clearCompletedTasks = function () {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.saveTasks();
    this.renderTasks();
  };
  
  // Initialize the TaskManager
  const taskManager = new TaskManager();
  
  // DOM elements
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const clearCompleted = document.getElementById('clearCompleted');
  const showCompleted = document.getElementById('showCompleted');
  
  // Add a task when the "Add Task" button is clicked
  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    taskManager.addTask(taskText);
    taskInput.value = ''; // Clear the input field
  });
  
  // Add a task when Enter is pressed in the input field
  taskInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      taskManager.addTask(taskInput.value.trim());
      taskInput.value = ''; // Clear the input field
    }
  });
  
  // Show/hide completed tasks when the "Show completed" checkbox changes
  showCompleted.addEventListener('change', () => {
    taskManager.renderTasks();
  });
  
  // Clear completed tasks when the "Clear Completed Tasks" button is clicked
  clearCompleted.addEventListener('click', () => {
    taskManager.clearCompletedTasks();
  });
  
  // Initial rendering of tasks
  taskManager.renderTasks();
  