let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ADD TASK */

function addTask(){

let name=document.getElementById("taskInput").value.trim();
let repeat=document.getElementById("repeat").value;
let reminder=document.getElementById("reminder").value;

if(name==="") return;

tasks.push({
name:name,
repeat:repeat,
reminder:reminder,
days:Array(30).fill(false),
streak:0,
level:1
});

document.getElementById("taskInput").value="";

save();
renderTasks();
renderHeatmap();

}

/* RENDER TASKS */

function renderTasks(){

let list=document.getElementById("taskList");
list.innerHTML="";

tasks.forEach((task,taskIndex)=>{

let card=document.createElement("div");
card.className="task-card";

/* HEADER */

let header=document.createElement("div");
header.className="task";

header.innerHTML=`
<span>${task.name}</span>
<div>
<button onclick="editTask(${taskIndex})">Edit</button>
<button onclick="deleteTask(${taskIndex})">Delete</button>
</div>
`;

card.appendChild(header);

/* STATS */

let stats=document.createElement("div");
stats.innerHTML=`🔥 Streak: ${task.streak} | ⭐ Level: ${task.level}`;
card.appendChild(stats);

/* MONTHLY GRID */

let grid=document.createElement("div");
grid.className="grid";

task.days.forEach((done,dayIndex)=>{

let box=document.createElement("div");
box.className="day";

if(done) box.classList.add("done");

box.onclick=()=>{
toggleDay(taskIndex,dayIndex);
};

grid.appendChild(box);

});

card.appendChild(grid);

list.appendChild(card);

});

}

/* TOGGLE DAY */

function toggleDay(taskIndex,dayIndex){

let task=tasks[taskIndex];

task.days[dayIndex]=!task.days[dayIndex];

updateStreak(task);

save();

renderTasks();
renderHeatmap();

}

/* STREAK SYSTEM */

function updateStreak(task){

let streak=0;

for(let i=0;i<task.days.length;i++){

if(task.days[i]) streak++;
else streak=0;

}

task.streak=streak;

/* LEVEL SYSTEM */

task.level=Math.floor(streak/5)+1;

}

/* DELETE */

function deleteTask(i){

tasks.splice(i,1);

save();
renderTasks();
renderHeatmap();

}

/* EDIT */

function editTask(i){

let newName=prompt("Edit task",tasks[i].name);

if(newName){

tasks[i].name=newName;

save();
renderTasks();

}

}

/* YEAR HEATMAP */

function renderHeatmap(){

let heat=document.getElementById("heatmap");

heat.innerHTML="";

for(let i=0;i<365;i++){

let box=document.createElement("div");
box.className="box";

let total=0;

tasks.forEach(t=>{
if(i<t.days.length && t.days[i]) total++;
});

let level=Math.min(total,12);

if(level>0) box.classList.add("c"+level);

heat.appendChild(box);

}

}

/* DARK MODE */

function toggleDark(){

document.body.classList.toggle("dark");

}

/* INITIAL LOAD */

renderTasks();
renderHeatmap();
