// ================================
// SAMPLE INTEGRATED RAILWAY DATA
// ================================

let tasks = JSON.parse(localStorage.getItem("railTasks")) || [

    {
        id: "TMS-101",
        department: "Engineering",
        asset: "Track KM 42/6",
        task: "Rail crack inspection",
        corridor: "Vijayawada - Guntur",
        criticality: 5,
        overdue: 4,
        safety: 5,
        impact: 5,
        duration: 2,
        status: "Pending"
    },

    {
        id: "SMMS-204",
        department: "Signal",
        asset: "Signal S-42",
        task: "Signal relay maintenance",
        corridor: "Guntur - Tenali",
        criticality: 4,
        overdue: 2,
        safety: 5,
        impact: 4,
        duration: 1,
        status: "Pending"
    },

    {
        id: "TDMS-301",
        department: "Traction",
        asset: "OHE Mast 87",
        task: "Contact wire inspection",
        corridor: "Vijayawada - Gudivada",
        criticality: 4,
        overdue: 5,
        safety: 4,
        impact: 5,
        duration: 3,
        status: "Pending"
    },

    {
        id: "TMS-118",
        department: "Engineering",
        asset: "Bridge BR-16",
        task: "Structural inspection",
        corridor: "Tenali - Ongole",
        criticality: 5,
        overdue: 7,
        safety: 5,
        impact: 5,
        duration: 3,
        status: "Pending"
    },

    {
        id: "SMMS-230",
        department: "Signal",
        asset: "Track Circuit TC-52",
        task: "Track circuit testing",
        corridor: "Vijayawada - Guntur",
        criticality: 3,
        overdue: 1,
        safety: 4,
        impact: 3,
        duration: 1,
        status: "Pending"
    },

    {
        id: "TDMS-318",
        department: "Traction",
        asset: "Substation TSS-08",
        task: "Transformer inspection",
        corridor: "Guntur - Tenali",
        criticality: 5,
        overdue: 3,
        safety: 5,
        impact: 5,
        duration: 2,
        status: "Pending"
    }

];


// ===============================
// CORRIDOR / COA DATA
// ===============================

const corridors = [

    {
        name: "Vijayawada - Guntur",
        availability: 72,
        traffic: "Medium",
        availableBlock: "00:30 - 03:30"
    },

    {
        name: "Guntur - Tenali",
        availability: 81,
        traffic: "Low",
        availableBlock: "01:00 - 04:00"
    },

    {
        name: "Vijayawada - Gudivada",
        availability: 61,
        traffic: "High",
        availableBlock: "02:00 - 04:30"
    },

    {
        name: "Tenali - Ongole",
        availability: 68,
        traffic: "Medium",
        availableBlock: "00:00 - 03:00"
    }

];


// ===============================
// PRIORITY AI MODEL
// ===============================

function calculatePriority(task) {

    let criticality =
        (task.criticality / 5) * 40;

    let overdueScore =
        Math.min(task.overdue / 7, 1) * 25;

    let safety =
        (task.safety / 5) * 20;

    let impact =
        (task.impact / 5) * 15;

    return Math.round(
        criticality +
        overdueScore +
        safety +
        impact
    );

}


// ===============================
// SAVE
// ===============================

function saveTasks() {

    localStorage.setItem(
        "railTasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// NAVIGATION
// ===============================

const buttons =
    document.querySelectorAll(".nav-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        buttons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        document.querySelectorAll(".page")
            .forEach(page =>
                page.classList.remove("active-page")
            );

        const page =
            button.dataset.page;

        document
            .getElementById(page)
            .classList.add("active-page");

    });

});


// ===============================
// RENDER TASKS
// ===============================

function renderTasks(filtered = tasks) {

    const table =
        document.getElementById("taskTable");

    table.innerHTML = "";

    filtered.forEach(task => {

        const score =
            calculatePriority(task);

        let level = "Low";

        if (task.criticality === 5)
            level = "Critical";

        else if (task.criticality === 4)
            level = "High";

        else if (task.criticality === 3)
            level = "Medium";


        table.innerHTML += `

        <tr>

            <td>${task.id}</td>

            <td>${task.department}</td>

            <td>${task.asset}</td>

            <td>${task.task}</td>

            <td>${task.corridor}</td>

            <td>
                <span class="tag ${level.toLowerCase()}">
                    ${level}
                </span>
            </td>

            <td>${task.overdue} days</td>

            <td>
                <strong>${score}</strong>
            </td>

            <td class="${
                task.status === "Scheduled"
                    ? "status-scheduled"
                    : "status-pending"
            }">

                ${task.status}

            </td>

        </tr>

        `;

    });

}


// ===============================
// DASHBOARD
// ===============================

function updateDashboard() {

    document.getElementById("totalTasks")
        .textContent =
        tasks.length;


    let critical =
        tasks.filter(
            task => task.criticality === 5
        ).length;


    document.getElementById(
        "criticalTasks"
    ).textContent =
        critical;


    let scheduled =
        tasks.filter(
            task => task.status === "Scheduled"
        ).length;


    document.getElementById(
        "scheduledTasks"
    ).textContent =
        scheduled;


    renderPriorityQueue();

}


// ===============================
// PRIORITY QUEUE
// ===============================

function renderPriorityQueue() {

    const container =
        document.getElementById("priorityQueue");

    container.innerHTML = "";

    let sorted =
        [...tasks]
        .sort(
            (a,b) =>
                calculatePriority(b)
                -
                calculatePriority(a)
        )
        .slice(0,5);


    sorted.forEach(task => {

        container.innerHTML += `

        <div class="priority-item">

            <div>

                <strong>
                    ${task.asset}
                </strong>

                <strong>
                    ${calculatePriority(task)}
                </strong>

            </div>

            <small>

                ${task.department}
                •
                ${task.task}

            </small>

        </div>

        `;

    });

}


// ===============================
// AI BLOCK OPTIMIZATION
// ===============================

function generateSchedule() {

    const status =
        document.getElementById(
            "optimizationStatus"
        );

    if(status){

        status.textContent =
            "AI optimization running...";

    }


    // Sort highest-risk maintenance first

    let optimized =
        [...tasks].sort(

            (a,b) =>
                calculatePriority(b)
                -
                calculatePriority(a)

        );


    let day = 0;

    optimized.forEach(task => {

        task.status =
            "Scheduled";

        task.scheduleDay =
            day % 7;

        const corridor =
            corridors.find(
                c =>
                c.name === task.corridor
            );

        task.block =
            corridor
                ?
                corridor.availableBlock
                :
                "01:00 - 03:00";

        day++;

    });


    tasks = optimized;

    saveTasks();

    renderSchedule();

    renderWeekly();

    renderMonthly();

    renderTasks();

    updateDashboard();


    if(status){

        status.textContent =
            "✓ Optimized successfully";

    }


    showToast(
        "AI block plan generated successfully"
    );

}


// ===============================
// SCHEDULE RESULTS
// ===============================

function renderSchedule() {

    const container =
        document.getElementById(
            "scheduleResults"
        );

    if(!container)
        return;

    container.innerHTML = "";


    tasks
    .filter(
        task =>
        task.status === "Scheduled"
    )
    .forEach(task => {

        container.innerHTML += `

        <div class="schedule-card">

            <div class="schedule-time">
                ${task.block}
            </div>

            <div>

                <strong>
                    ${task.asset}
                </strong>

                <br>

                <small>
                    ${task.task}
                </small>

            </div>

            <div>

                ${task.corridor}

            </div>

            <div>

                Score:
                <strong>
                    ${calculatePriority(task)}
                </strong>

            </div>

        </div>

        `;

    });

}


// ===============================
// WEEKLY PLAN
// ===============================

function renderWeekly() {

    const days = [

        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"

    ];


    const container =
        document.getElementById(
            "weeklyPlan"
        );

    container.innerHTML = "";


    days.forEach(
        (day,index) => {

            let assigned =
                tasks.filter(
                    task =>
                        task.scheduleDay
                        ===
                        index
                );


            let html = `

            <div class="day">

                <h3>
                    ${day}
                </h3>

            `;


            if(
                assigned.length
                ===
                0
            ){

                html += `

                <p style="
                    color:#62758b;
                    font-size:12px;
                ">

                    No maintenance block

                </p>

                `;

            }


            assigned.forEach(task => {

                html += `

                <div class="day-task">

                    <strong>
                        ${task.asset}
                    </strong>

                    <br>

                    ${task.block}

                    <br>

                    ${task.department}

                </div>

                `;

            });


            html += "</div>";

            container.innerHTML += html;

        }

    );

}


// ===============================
// MONTHLY PLAN
// ===============================

function renderMonthly() {

    const container =
        document.getElementById(
            "monthlyPlan"
        );

    container.innerHTML = "";


    for(
        let day = 1;
        day <= 30;
        day++
    ){

        let task =
            tasks[
                (day - 1)
                %
                tasks.length
            ];


        let maintenance =
            day % 3 === 0
                ?
                `
                <div class="day-task">

                    ${task.asset}

                    <br>

                    ${task.department}

                </div>
                `
                :
                "";


        container.innerHTML += `

        <div class="calendar-day">

            <strong>
                ${day}
            </strong>

            ${maintenance}

        </div>

        `;

    }

}


// ===============================
// CORRIDOR STATUS
// ===============================

function renderCorridors() {

    const container =
        document.getElementById(
            "corridorGrid"
        );


    corridors.forEach(
        corridor => {

            container.innerHTML += `

            <div class="corridor-card">

                <h3>
                    ${corridor.name}
                </h3>

                <p style="
                    margin-top:10px;
                    color:#7890aa;
                ">

                    Traffic Density:
                    ${corridor.traffic}

                </p>

                <p style="
                    margin-top:8px;
                ">

                    Available Maintenance Block:

                    <strong>

                        ${corridor.availableBlock}

                    </strong>

                </p>

                <div class="corridor-bar">

                    <div
                        class="corridor-progress"
                        style="
                        width:
                        ${corridor.availability}%
                        "
                    >
                    </div>

                </div>

                <small>

                    Corridor availability:
                    ${corridor.availability}%

                </small>

            </div>

            `;

        }

    );

}


// ===============================
// SEARCH
// ===============================

document
.getElementById("searchTask")
.addEventListener(
    "input",
    filterTasks
);


document
.getElementById("departmentFilter")
.addEventListener(
    "change",
    filterTasks
);


function filterTasks() {

    const search =
        document
        .getElementById(
            "searchTask"
        )
        .value
        .toLowerCase();


    const department =
        document
        .getElementById(
            "departmentFilter"
        )
        .value;


    let filtered =
        tasks.filter(
            task => {

                const matchSearch =

                    task.asset
                    .toLowerCase()
                    .includes(search)

                    ||

                    task.task
                    .toLowerCase()
                    .includes(search)

                    ||

                    task.corridor
                    .toLowerCase()
                    .includes(search);


                const matchDepartment =

                    department === "all"

                    ||

                    task.department
                    ===
                    department;


                return (
                    matchSearch
                    &&
                    matchDepartment
                );

            }

        );


    renderTasks(filtered);

}


// ===============================
// ADD TASK
// ===============================

function openModal() {

    document
    .getElementById(
        "taskModal"
    )
    .style.display =
        "flex";

}


function closeModal() {

    document
    .getElementById(
        "taskModal"
    )
    .style.display =
        "none";

}


document
.getElementById("taskForm")
.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const department =
            document
            .getElementById(
                "newDepartment"
            )
            .value;


        let prefix =
            department ===
            "Engineering"
                ?
                "TMS"
                :
                department ===
                "Signal"
                ?
                "SMMS"
                :
                "TDMS";


        let task = {

            id:
                prefix
                +
                "-"
                +
                Math.floor(
                    100
                    +
                    Math.random()
                    *
                    899
                ),

            department,

            asset:
                document
                .getElementById(
                    "newAsset"
                )
                .value,

            task:
                document
                .getElementById(
                    "newTask"
                )
                .value,

            corridor:
                document
                .getElementById(
                    "newCorridor"
                )
                .value,

            criticality:
                Number(
                    document
                    .getElementById(
                        "newCriticality"
                    )
                    .value
                ),

            overdue:
                Number(
                    document
                    .getElementById(
                        "newOverdue"
                    )
                    .value
                ),

            safety: 4,

            impact: 4,

            duration: 2,

            status:
                "Pending"

        };


        tasks.push(task);

        saveTasks();

        renderTasks();

        updateDashboard();

        closeModal();

        this.reset();


        showToast(
            "Maintenance task added successfully"
        );

    }

);


// ===============================
// TOAST
// ===============================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// ===============================
// CHARTS
// ===============================

function createCharts() {

    const engineering =
        tasks.filter(
            t =>
            t.department ===
            "Engineering"
        ).length;


    const signal =
        tasks.filter(
            t =>
            t.department ===
            "Signal"
        ).length;


    const traction =
        tasks.filter(
            t =>
            t.department ===
            "Traction"
        ).length;


    new Chart(

        document
        .getElementById(
            "departmentChart"
        ),

        {

            type:
                "doughnut",

            data: {

                labels: [

                    "Engineering",
                    "Signal & Telecom",
                    "Traction"

                ],

                datasets: [

                    {

                        data: [

                            engineering,
                            signal,
                            traction

                        ],

                        backgroundColor: [

                            "#148DFF",
                            "#A264FF",
                            "#28D790"

                        ],

                        borderWidth: 0

                    }

                ]

            },

            options: {

                plugins: {

                    legend: {

                        labels: {

                            color:
                                "#B9C8DA"

                        }

                    }

                }

            }

        }

    );


    new Chart(

        document
        .getElementById(
            "availabilityChart"
        ),

        {

            type:
                "line",

            data: {

                labels: [

                    "Week 1",
                    "Week 2",
                    "Week 3",
                    "Week 4",
                    "Week 5",
                    "Week 6"

                ],

                datasets: [

                    {

                        label:
                            "Asset Availability %",

                        data: [

                            87,
                            89,
                            91,
                            93,
                            95,
                            96

                        ],

                        borderColor:
                            "#2EAEFF",

                        backgroundColor:
                            "rgba(46,174,255,.15)",

                        fill:
                            true,

                        tension:
                            .4

                    }

                ]

            },

            options: {

                scales: {

                    x: {

                        ticks: {

                            color:
                                "#8196AC"

                        }

                    },

                    y: {

                        ticks: {

                            color:
                                "#8196AC"

                        },

                        min: 80,

                        max: 100

                    }

                },

                plugins: {

                    legend: {

                        labels: {

                            color:
                                "#B8CADC"

                        }

                    }

                }

            }

        }

    );


    new Chart(

        document
        .getElementById(
            "riskChart"
        ),

        {

            type:
                "bar",

            data: {

                labels: [

                    "Manual Planning",
                    "AI Planning"

                ],

                datasets: [

                    {

                        label:
                            "Maintenance Conflicts",

                        data: [

                            28,
                            7

                        ],

                        backgroundColor: [

                            "#E45E6B",
                            "#3CD58A"

                        ]

                    }

                ]

            },

            options: {

                scales: {

                    x: {

                        ticks: {

                            color:
                                "#8196AC"

                        }

                    },

                    y: {

                        ticks: {

                            color:
                                "#8196AC"

                        }

                    }

                },

                plugins: {

                    legend: {

                        labels: {

                            color:
                                "#B8CADC"

                        }

                    }

                }

            }

        }

    );

}


// ===============================
// INITIALIZE SYSTEM
// ===============================

function initialize() {

    renderTasks();

    updateDashboard();

    renderSchedule();

    renderWeekly();

    renderMonthly();

    renderCorridors();

    createCharts();

}


initialize();