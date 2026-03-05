let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {

    const name = document.getElementById("taskName").value;
    const reminder = document.getElementById("reminder").value;
    const repeat = document.getElementById("repeat").value;

    if(name.trim() === "") return;

    const task = {
        id: Date.now(),
        name: name,
        reminder: reminder,
        repeat: repeat,
        days: Array(30).fill(0),
        streak: 0,
        level: 1
    };

    tasks.push(task);

    document.getElementById("taskName").value = "";

    saveData();
    renderTasks();
    updateHeatmap();
}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveData();
    renderTasks();
    updateHeatmap();
}

function editTask(id) {

    const task = tasks.find(t => t.id === id);

    const newName = prompt("Edit task name", task.name);

    if(newName){
        task.name = newName;
    }

    saveData();
    renderTasks();
}

function toggleDay(taskId, dayIndex) {

    const task = tasks.find(t => t.id === taskId);

    task.days[dayIndex] = task.days[dayIndex] ? 0 : 1;

    calculateStreak(task);
    calculateLevel(task);

    saveData();
    renderTasks();
    updateHeatmap();
}

function calculateStreak(task) {

    let streak = 0;

    for(let i = task.days.length - 1; i >= 0; i--) {

        if(task.days[i] === 1){
            streak++;
        }else{
            break;
        }

    }

    task.streak = streak;
}

function calculateLevel(task){

    const total = task.days.reduce((a,b)=>a+b,0);

    task.level = Math.floor(total / 10) + 1;
}

function renderTasks(){

    const container = document.getElementById("taskList");

    container.innerHTML = "";

    tasks.forEach(task => {

        const div = document.createElement("div");
        div.className = "task";

        const title = document.createElement("h3");
        title.innerText = task.name;

        const streak = document.createElement("p");
        streak.innerText = "🔥 Streak: " + task.streak;

        const level = document.createElement("p");
        level.innerText = "⭐ Level: " + task.level;

        const grid = document.createElement("div");
        grid.className = "tracker";

        task.days.forEach((d,i)=>{

            const cell = document.createElement("div");

            cell.className = "day";

            if(d === 1){
                cell.classList.add("done");
            }

            cell.onclick = () => toggleDay(task.id,i);

            grid.appendChild(cell);

        });

        const edit = document.createElement("button");
        edit.innerText = "Edit";
        edit.onclick = () => editTask(task.id);

        const del = document.createElement("button");
        del.innerText = "Delete";
        del.onclick = () => deleteTask(task.id);

        const reminder = document.createElement("p");
        reminder.innerText = "Reminder: " + task.reminder;

        const repeat = document.createElement("p");
        repeat.innerText = "Repeat: " + task.repeat;

        div.appendChild(title);
        div.appendChild(streak);
        div.appendChild(level);
        div.appendChild(reminder);
        div.appendChild(repeat);
        div.appendChild(grid);
        div.appendChild(edit);
        div.appendChild(del);

        container.appendChild(div);

    });
}

function updateHeatmap(){

    const heatmap = document.getElementById("heatmap");

    if(!heatmap) return;

    heatmap.innerHTML = "";

    for(let i=0;i<365;i++){

        const cell = document.createElement("div");

        cell.className = "heat-cell";

        let total = 0;

        tasks.forEach(task => {

            const index = i % 30;

            if(task.days[index]){
                total++;
            }

        });

        cell.style.opacity = total / (tasks.length || 1);

        heatmap.appendChild(cell);

    }

}

function weeklyDashboard(){

    let completed = 0;

    tasks.forEach(task=>{

        for(let i=23;i<30;i++){

            if(task.days[i]) completed++;

        }

    });

    alert("Weekly completed tasks: " + completed);
}

function yearlyDashboard(){

    let total = 0;

    tasks.forEach(task=>{

        total += task.days.reduce((a,b)=>a+b,0);

    });

    alert("Yearly completion score: " + total);
}

function checkReminders(){

    const now = new Date();

    const current = now.getHours() + ":" + now.getMinutes();

    tasks.forEach(task=>{

        if(task.reminder === current){

            alert("Reminder for task: " + task.name);

        }

    });

}

setInterval(checkReminders,60000);

renderTasks();
updateHeatmap();
