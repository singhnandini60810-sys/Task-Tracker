// ================================
// DATA
// ================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function saveData(){
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// ================================
// ADD TASK
// ================================

function addTask(){

    const name = document.getElementById("taskName").value
    const reminder = document.getElementById("reminder").value
    const repeat = document.getElementById("repeat").value

    if(name.trim() === ""){
        alert("Enter task name")
        return
    }

    const task = {

        id: Date.now(),
        name: name,

        reminder: reminder,
        repeat: repeat,

        days: new Array(30).fill(0),

        streak: 0,
        level: 1
    }

    tasks.push(task)

    document.getElementById("taskName").value = ""

    saveData()
    renderTasks()
    renderHeatmap()

}

// ================================
// DELETE TASK
// ================================

function deleteTask(id){

    tasks = tasks.filter(t => t.id !== id)

    saveData()
    renderTasks()
    renderHeatmap()

}

// ================================
// EDIT TASK
// ================================

function editTask(id){

    const task = tasks.find(t => t.id === id)

    const newName = prompt("Edit task", task.name)

    if(newName){
        task.name = newName
    }

    saveData()
    renderTasks()

}

// ================================
// TOGGLE DAY
// ================================

function toggleDay(taskId, index){

    const task = tasks.find(t => t.id === taskId)

    task.days[index] = task.days[index] ? 0 : 1

    calculateStreak(task)
    calculateLevel(task)

    saveData()
    renderTasks()
    renderHeatmap()

}

// ================================
// STREAK SYSTEM
// ================================

function calculateStreak(task){

    let streak = 0

    for(let i = task.days.length-1; i >=0; i--){

        if(task.days[i] === 1){
            streak++
        }
        else{
            break
        }

    }

    task.streak = streak
}

// ================================
// LEVEL SYSTEM
// ================================

function calculateLevel(task){

    const total = task.days.reduce((a,b)=>a+b,0)

    task.level = Math.floor(total/10)+1

}

// ================================
// RENDER TASKS
// ================================

function renderTasks(){

    const container = document.getElementById("taskList")

    container.innerHTML = ""

    tasks.forEach(task => {

        const box = document.createElement("div")
        box.className = "task"

        const title = document.createElement("h3")
        title.innerText = task.name

        const streak = document.createElement("p")
        streak.innerText = "🔥 Streak: " + task.streak

        const level = document.createElement("p")
        level.innerText = "⭐ Level: " + task.level

        const reminder = document.createElement("p")
        reminder.innerText = "Reminder: " + task.reminder

        const repeat = document.createElement("p")
        repeat.innerText = "Repeat: " + task.repeat

        const grid = document.createElement("div")
        grid.className = "tracker"

        task.days.forEach((d,i)=>{

            const cell = document.createElement("div")

            cell.className = "day"

            if(d === 1){
                cell.classList.add("done")
            }

            cell.onclick = ()=>toggleDay(task.id,i)

            grid.appendChild(cell)

        })

        const editBtn = document.createElement("button")
        editBtn.innerText = "Edit"
        editBtn.onclick = ()=>editTask(task.id)

        const delBtn = document.createElement("button")
        delBtn.innerText = "Delete"
        delBtn.onclick = ()=>deleteTask(task.id)

        box.appendChild(title)
        box.appendChild(streak)
        box.appendChild(level)
        box.appendChild(reminder)
        box.appendChild(repeat)
        box.appendChild(grid)
        box.appendChild(editBtn)
        box.appendChild(delBtn)

        container.appendChild(box)

    })

}

// ================================
// 12 COLOR HEATMAP
// ================================

function renderHeatmap(){

    const map = document.getElementById("heatmap")

    if(!map) return

    map.innerHTML = ""

    for(let i=0;i<365;i++){

        const cell = document.createElement("div")
        cell.className = "heat"

        let count = 0

        tasks.forEach(task=>{

            const index = i % 30

            if(task.days[index]){
                count++
            }

        })

        const level = Math.min(11,count)

        cell.style.background =
        `rgba(128,0,128,${level/11})`

        map.appendChild(cell)

    }

}

// ================================
// WEEKLY DASHBOARD
// ================================

function weeklyDashboard(){

    let total = 0

    tasks.forEach(task=>{

        for(let i=23;i<30;i++){

            if(task.days[i]){
                total++
            }

        }

    })

    alert("Weekly completions: "+total)

}

// ================================
// YEARLY DASHBOARD
// ================================

function yearlyDashboard(){

    let total = 0

    tasks.forEach(task=>{

        total += task.days.reduce((a,b)=>a+b,0)

    })

    alert("Total yearly completions: "+total)

}

// ================================
// REMINDER SYSTEM
// ================================

function checkReminders(){

    const now = new Date()

    const h = now.getHours().toString().padStart(2,"0")
    const m = now.getMinutes().toString().padStart(2,"0")

    const current = `${h}:${m}`

    tasks.forEach(task=>{

        if(task.reminder === current){

            alert("Reminder: "+task.name)

        }

    })

}

setInterval(checkReminders,60000)

// ================================
// INIT
// ================================

renderTasks()
renderHeatmap()
