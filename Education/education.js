const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://ahies-research-api-enfbb7htfsacf3g7.spaincentral-01.azurewebsites.net";

const EDUCATION_API = `${BASE_URL}/api/education`;
const ATTAINMENT_API = `${BASE_URL}/api/education/attainment`;
const BARRIERS_API = `${BASE_URL}/api/education/barriers`;


let educationData = [];
let attainmentData = [];
let barriersData = [];

let educationChart;
let attendanceChart;
let attainmentChart;
let barriersChart;
let financeChart;


// ======================================================
// RESEARCH FINDINGS FROM SQL ANALYSIS
// ======================================================

// RQ1: School attendance during previous three months

const attendanceResearch = [

    { year: 2022, rate: 46.69 },

    { year: 2023, rate: 48.63 },

    { year: 2024, rate: 48.27 }

];


// RQ4: Education financing

const financeResearch = {

    labels: [
        "Father",
        "Both Parents",
        "Mother",
        "Other Relative (HH)",
        "Other Relative (Non-HH)",
        "Self"
    ],

    years: {

        2022: [
            48.55,
            19.05,
            19.92,
            8.65,
            2.35,
            0.82
        ],

        2023: [
            43.90,
            25.00,
            18.60,
            8.47,
            2.52,
            0.86
        ],

        2024: [
            42.61,
            27.56,
            18.00,
            7.94,
            2.39,
            0.90
        ]

    }

};


// ======================================================
// LOAD ALL EDUCATION DATA
// ======================================================

async function loadEducationData() {

    try {

        const responses = await Promise.all([

            fetch(EDUCATION_API),

            fetch(ATTAINMENT_API),

            fetch(BARRIERS_API)

        ]);


        responses.forEach(response => {

            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }

        });


        educationData =
            await responses[0].json();

        attainmentData =
            await responses[1].json();

        barriersData =
            await responses[2].json();


        console.log(
            "Education overview:",
            educationData
        );

        console.log(
            "Educational attainment:",
            attainmentData
        );

        console.log(
            "Education barriers:",
            barriersData
        );


        updatePage("all");


    } catch (error) {

        console.error(
            "Education API error:",
            error
        );

    }

}


// ======================================================
// UPDATE ENTIRE PAGE
// ======================================================

function updatePage(selectedYear) {

    let filteredData;


    if (selectedYear === "all") {

        filteredData = educationData;

    } else {

        filteredData = educationData.filter(

            row =>
                String(row.year) === selectedYear

        );

    }


    updateIndicators(filteredData);

    updateTable(filteredData);

    updateChart(filteredData);

    updateAttendanceChart(selectedYear);

    updateAttainmentChart(selectedYear);

    updateBarriersChart(selectedYear);

    updateFinanceChart(selectedYear);

}


// ======================================================
// INDICATOR CARDS
// ======================================================

function updateIndicators(data) {

    const totalRecords = data.reduce(

        (sum, row) =>
            sum + Number(
                row.total_records || 0
            ),

        0

    );


    const currentlySchool = data.reduce(

        (sum, row) =>
            sum + Number(
                row.currently_in_school || 0
            ),

        0

    );


    const everAttended = data.reduce(

        (sum, row) =>
            sum + Number(
                row.ever_attended_school || 0
            ),

        0

    );


    document
        .getElementById(
            "total-records"
        )
        .textContent =
        totalRecords.toLocaleString();


    document
        .getElementById(
            "currently-school"
        )
        .textContent =
        currentlySchool.toLocaleString();


    document
        .getElementById(
            "ever-attended"
        )
        .textContent =
        everAttended.toLocaleString();

}


// ======================================================
// ANNUAL DATA TABLE
// ======================================================

function updateTable(data) {

    const tableBody =
        document.getElementById(
            "education-table"
        );


    tableBody.innerHTML = "";


    data.forEach(row => {

        const tableRow =
            document.createElement("tr");


        tableRow.innerHTML = `

            <td>
                ${row.year}
            </td>

            <td>
                ${Number(
                    row.total_records
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.currently_in_school
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.ever_attended_school
                ).toLocaleString()}
            </td>

        `;


        tableBody.appendChild(
            tableRow
        );

    });

}


// ======================================================
// OVERVIEW PARTICIPATION CHART
// ======================================================

function updateChart(data) {

    const canvas =
        document.getElementById(
            "educationChart"
        );


    if (educationChart) {

        educationChart.destroy();

    }


    educationChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    data.map(
                        row => row.year
                    ),

                datasets: [

                    {
                        label:
                            "Currently in School",

                        data:
                            data.map(
                                row =>
                                    Number(
                                        row.currently_in_school
                                    )
                            )
                    },

                    {
                        label:
                            "Ever Attended School",

                        data:
                            data.map(
                                row =>
                                    Number(
                                        row.ever_attended_school
                                    )
                            )
                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        position: "top"
                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback:
                                function(value) {

                                    return value
                                        .toLocaleString();

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ1
// SCHOOL ATTENDANCE
// ======================================================

function updateAttendanceChart(
    selectedYear
) {

    let data =
        attendanceResearch;


    if (selectedYear !== "all") {

        data =
            attendanceResearch.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    const canvas =
        document.getElementById(
            "attendanceChart"
        );


    if (attendanceChart) {

        attendanceChart.destroy();

    }


    attendanceChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    data.map(
                        row => row.year
                    ),

                datasets: [

                    {
                        label:
                            "Attended School (%)",

                        data:
                            data.map(
                                row => row.rate
                            ),

                        tension: 0.3,

                        pointRadius: 6,

                        pointHoverRadius: 8

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    tooltip: {

                        callbacks: {

                            label:
                                function(context) {

                                    return (
                                        context
                                            .dataset
                                            .label +
                                        ": " +
                                        context
                                            .raw
                                            .toFixed(2) +
                                        "%"
                                    );

                                }

                        }

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        title: {

                            display: true,

                            text:
                                "Percentage of Respondents"

                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return (
                                        value + "%"
                                    );

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ2
// HIGHEST EDUCATIONAL ATTAINMENT
// ======================================================

function updateAttainmentChart(
    selectedYear
) {

    let data =
        attainmentData;


    if (selectedYear !== "all") {

        data =
            attainmentData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    // Combine the selected records by education level.
    // For "All Years", the same category is summed
    // across 2022, 2023 and 2024.

    const grouped = {};


    data.forEach(row => {

        const level =
            row.education_level;

        const total =
            Number(row.total || 0);


        if (!grouped[level]) {

            grouped[level] = 0;

        }


        grouped[level] += total;

    });


    const grandTotal =
        Object.values(grouped)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    const chartData =
        Object.entries(grouped)
            .map(
                ([level, total]) => ({

                    level: level,

                    total: total,

                    percentage:
                        grandTotal > 0
                            ? (
                                total /
                                grandTotal
                            ) * 100
                            : 0

                })
            )
            .sort(
                (a, b) =>
                    b.percentage -
                    a.percentage
            );


    const canvas =
        document.getElementById(
            "attainmentChart"
        );


    if (attainmentChart) {

        attainmentChart.destroy();

    }


    attainmentChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    chartData.map(
                        row => row.level
                    ),

                datasets: [

                    {
                        label:
                            "Share of Respondents (%)",

                        data:
                            chartData.map(
                                row =>
                                    row.percentage
                            )

                    }

                ]

            },


            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                function(context) {

                                    const item =
                                        chartData[
                                            context.dataIndex
                                        ];


                                    return (
                                        item.percentage
                                            .toFixed(2) +
                                        "% (" +
                                        item.total
                                            .toLocaleString() +
                                        " respondents)"
                                    );

                                }

                        }

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Percentage of Respondents"

                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return (
                                        value + "%"
                                    );

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ3
// REASONS FOR NEVER ATTENDING SCHOOL
// ======================================================

function updateBarriersChart(
    selectedYear
) {

    let data =
        barriersData;


    if (selectedYear !== "all") {

        data =
            barriersData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    const grouped = {};


    data.forEach(row => {

        const reason =
            row.reason;

        const total =
            Number(row.total || 0);


        if (!grouped[reason]) {

            grouped[reason] = 0;

        }


        grouped[reason] += total;

    });


    const grandTotal =
        Object.values(grouped)
            .reduce(
                (sum, value) =>
                    sum + value,
                0
            );


    const chartData =
        Object.entries(grouped)
            .map(
                ([reason, total]) => ({

                    reason: reason,

                    total: total,

                    percentage:
                        grandTotal > 0
                            ? (
                                total /
                                grandTotal
                            ) * 100
                            : 0

                })
            )
            .sort(
                (a, b) =>
                    b.percentage -
                    a.percentage
            );


    const canvas =
        document.getElementById(
            "barriersChart"
        );


    if (barriersChart) {

        barriersChart.destroy();

    }


    barriersChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    chartData.map(
                        row => row.reason
                    ),

                datasets: [

                    {
                        label:
                            "Share of Responses (%)",

                        data:
                            chartData.map(
                                row =>
                                    row.percentage
                            )

                    }

                ]

            },


            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {

                        callbacks: {

                            label:
                                function(context) {

                                    const item =
                                        chartData[
                                            context.dataIndex
                                        ];


                                    return (
                                        item.percentage
                                            .toFixed(2) +
                                        "% (" +
                                        item.total
                                            .toLocaleString() +
                                        " responses)"
                                    );

                                }

                        }

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Percentage of Responses"

                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return (
                                        value + "%"
                                    );

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ4
// EDUCATION FINANCING
// ======================================================

function updateFinanceChart(
    selectedYear
) {

    const canvas =
        document.getElementById(
            "financeChart"
        );


    if (financeChart) {

        financeChart.destroy();

    }


    let datasets;


    if (selectedYear === "all") {

        datasets = [

            {
                label: "2022",

                data:
                    financeResearch
                        .years[2022]
            },

            {
                label: "2023",

                data:
                    financeResearch
                        .years[2023]
            },

            {
                label: "2024",

                data:
                    financeResearch
                        .years[2024]
            }

        ];

    } else {

        datasets = [

            {
                label:
                    selectedYear,

                data:
                    financeResearch
                        .years[
                            Number(
                                selectedYear
                            )
                        ]

            }

        ];

    }


    financeChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    financeResearch.labels,

                datasets:
                    datasets

            },


            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    tooltip: {

                        callbacks: {

                            label:
                                function(context) {

                                    return (
                                        context
                                            .dataset
                                            .label +
                                        ": " +
                                        context
                                            .raw
                                            .toFixed(2) +
                                        "%"
                                    );

                                }

                        }

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Percentage of Respondents"

                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return (
                                        value + "%"
                                    );

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// YEAR FILTER
// ======================================================

document
    .getElementById(
        "year-filter"
    )
    .addEventListener(
        "change",
        function() {

            updatePage(
                this.value
            );

        }
    );


// ======================================================
// START PAGE
// ======================================================

loadEducationData();