let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-enter");
    setTimeout(() => li.classList.add("task-enter-active"), 10);

    if (task.editing) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.text;
      input.addEventListener("input", (e) => {
        tasks[index].text = e.target.value;
      });

      const dateInput = document.createElement("input");
      dateInput.type = "datetime-local";
      dateInput.value = task.due || "";
      dateInput.addEventListener("input", (e) => {
        tasks[index].due = e.target.value;
      });

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.onclick = () => {
        tasks[index].editing = false;
        saveTasks();
        renderTasks();
      };

      li.append(input, dateInput, saveBtn);
    } else {
      li.textContent = task.text;

      const due = document.createElement("div");
      due.className = "due-time";
      if (task.due) due.textContent = "🕒 " + new Date(task.due).toLocaleString();
      li.appendChild(due);

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.onclick = () => {
        tasks[index].editing = true;
        renderTasks();
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => animateDelete(li, index);

      actions.append(editBtn, deleteBtn);
      li.appendChild(actions);
    }

    list.appendChild(li);
  });
}

// Add task
function addTask() {
  const input = document.getElementById("task-input");
  const datetime = document.getElementById("task-time");

  const text = input.value.trim();
  const due = datetime.value;

  if (text !== "") {
    tasks.push({ text, due, editing: false });
    input.value = "";
    datetime.value = "";
    saveTasks();
    renderTasks();
  }
}

// Animate deletion
function animateDelete(element, index) {
  element.classList.add("task-exit");
  setTimeout(() => element.classList.add("task-exit-active"), 10);
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 300);
}

// Dark mode toggle
const themeSwitch = document.getElementById("theme-switch");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});

// Initial load
renderTasks();