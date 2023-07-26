const form = document.querySelector('#form');
const userInput = document.querySelector('#userInput');
const taskList = document.querySelector(`#taskList`);
const listEmpty = document.querySelector(`#listEmpty`);

form.addEventListener('submit', addtask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', checkDoneTask);

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => buildTask(task));
}

checkEmptiness();

function buildTask(currentTask) {
    const doneClass = currentTask.done ? "task-block__item item-fill item-fill_done"  : " task-block__item item-fill";
    const isChecked = currentTask.done ? "checked" : "";

    const listElement = 
        `<li id="${currentTask.id}"class="${doneClass}">
            <div class="item-fill__title">${currentTask.content}</div>
            <div class="item-fill__buttons item-buttons">
                <input type="checkbox" data-action="done" class="item-buttons__done _buttons" ${isChecked}></input>
                <button type="button" data-action="delete" class="item-buttons__delete _buttons">
                    <img src="img/delete.png" alt="Delete">
                </button>
            </div>
        </li>`;

    taskList.insertAdjacentHTML('afterbegin', listElement);
}



function addtask(event) {
    event.preventDefault();
    
    const userText = userInput.value;

    const task = {
        id: Date.now(),
        content: userText,
        done: false
    }

    tasks.push(task);
    buildTask(task);
    checkEmptiness();
    saveToLocalStorage();

    userInput.value = "";
    userInput.focus();
}

function checkDoneTask(event) {
    if(event.target.dataset.action === 'done') {
        const parent = event.target.closest('.item-fill');
        const task = tasks.find((task) => task.id === +parent.id);

        if(task.done === true) {
            parent.classList.remove('item-fill_done');
            task.done = false;
        } 
        else {
            parent.classList.add('item-fill_done');
            task.done = true;
        }

        saveToLocalStorage();
    }
}

function deleteTask(event) {
    if(event.target.dataset.action === 'delete') {
        const parent = event.target.closest('.item-fill');

        tasks = tasks.filter((task) => task.id !== +parent.id);
        parent.remove();
        
        checkEmptiness();
        saveToLocalStorage();
    }
}

function checkEmptiness() {
    if(tasks.length === 0 ) {
        const emptyListElement = 
            `<li class="task-block__item item-empty" id="listEmpty">
                <img src="img/emptyList.png" alt="Empty">
                <span class="item-empty__title">Список задач пуст</span>
            </li>`

        taskList.insertAdjacentHTML('afterbegin', emptyListElement);
    } 
    else {
        const emptyListElement = document.querySelector('#listEmpty');
        emptyListElement ? emptyListElement.remove() : null;
    }

}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

