const HEALTH_API =
    "http://127.0.0.1:5000/api/health";

const ILLNESS_SEX_API =
    "http://127.0.0.1:5000/api/health/illness-by-sex";

const COVERAGE_API =
    "http://127.0.0.1:5000/api/health/coverage";


let healthData = [];
let illnessSexData = [];
let coverageData = [];

let healthChart;
let illnessSexChart;
let consultationChart;
let insuranceChart;


// ======================================================
// LOAD ALL HEALTH DATA
// ======================================================

async function loadHealthData() {

    try {

        const responses = await Promise.all([

            fetch(HEALTH_API),

            fetch(ILLNESS_SEX_API),

            fetch(COVERAGE_API)

        ]);


        responses.forEach(response => {

            if (!response.ok) {

                throw new Error(
                    `HTTP error: ${response.status}`
                );

            }

        });


        healthData =
            await responses[0].json();

        illnessSexData =
            await responses[1].json();

        coverageData =
            await responses[2].json();


        console.log(
            "Health overview:",
            healthData
        );

        console.log(
            "Illness by sex:",
            illnessSexData
        );

        console.log(
            "NHIS coverage:",
            coverageData
        );


        updatePage("all");


    } catch (error) {

        console.error(
            "Health API error:",
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

        filteredData = healthData;

    } else {

        filteredData =
            healthData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    updateIndicators(filteredData);

    updateTable(filteredData);

    updateHealthChart(filteredData);

    updateIllnessSexChart(selectedYear);

    updateConsultationChart(selectedYear);

    updateInsuranceChart(selectedYear);

}


// ======================================================
// INDICATOR CARDS
// ======================================================

function updateIndicators(data) {

    const totalRecords =
        data.reduce(

            (sum, row) =>
                sum +
                Number(
                    row.total_records || 0
                ),

            0

        );


    const recentIllness =
        data.reduce(

            (sum, row) =>
                sum +
                Number(
                    row.recent_illness || 0
                ),

            0

        );


    const nhisCovered =
        data.reduce(

            (sum, row) =>
                sum +
                Number(
                    row.nhis_covered || 0
                ),

            0

        );


    const consultedPractitioner =
        data.reduce(

            (sum, row) =>
                sum +
                Number(
                    row.consulted_health_practitioner || 0
                ),

            0

        );


    document
        .getElementById("total-records")
        .textContent =
        totalRecords.toLocaleString();


    document
        .getElementById("recent-illness")
        .textContent =
        recentIllness.toLocaleString();


    document
        .getElementById("nhis-covered")
        .textContent =
        nhisCovered.toLocaleString();


    document
        .getElementById("consulted-practitioner")
        .textContent =
        consultedPractitioner.toLocaleString();

}


// ======================================================
// TABLE
// ======================================================

function updateTable(data) {

    const tableBody =
        document.getElementById(
            "health-table"
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
                    row.recent_illness
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.nhis_covered
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.consulted_health_practitioner
                ).toLocaleString()}
            </td>

        `;


        tableBody.appendChild(
            tableRow
        );

    });

}


// ======================================================
// OVERVIEW HEALTH CHART
// ======================================================

function updateHealthChart(data) {

    const canvas =
        document.getElementById(
            "healthChart"
        );


    if (healthChart) {

        healthChart.destroy();

    }


    healthChart =
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
                            "Recent Illness",

                        data:
                            data.map(
                                row =>
                                    Number(
                                        row.recent_illness
                                    )
                            )
                    },


                    {
                        label:
                            "NHIS Covered",

                        data:
                            data.map(
                                row =>
                                    Number(
                                        row.nhis_covered
                                    )
                            )
                    },


                    {
                        label:
                            "Consulted Health Practitioner",

                        data:
                            data.map(
                                row =>
                                    Number(
                                        row.consulted_health_practitioner
                                    )
                            )
                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

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
// REPORTED ILLNESS BY SEX
// ======================================================

function updateIllnessSexChart(
    selectedYear
) {

    let data =
        illnessSexData;


    if (selectedYear !== "all") {

        data =
            illnessSexData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    const years = [

        ...new Set(
            data.map(row => row.year)
        )

    ].sort();


    const sexes = [

        ...new Set(
            data.map(row => row.sex)
        )

    ];


    const datasets =
        sexes.map(sex => {

            return {

                label: sex,

                data:
                    years.map(year => {

                        const row =
                            data.find(

                                item =>
                                    String(item.year) ===
                                    String(year) &&
                                    item.sex === sex

                            );


                        return row
                            ? Number(row.total)
                            : 0;

                    })

            };

        });


    const canvas =
        document.getElementById(
            "illnessSexChart"
        );


    if (illnessSexChart) {

        illnessSexChart.destroy();

    }


    illnessSexChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: years,

                datasets: datasets

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
                                        context.dataset.label +
                                        ": " +
                                        Number(
                                            context.raw
                                        ).toLocaleString()
                                    );

                                }

                        }

                    }

                },

                scales: {

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Reported Illness Cases"

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ2
// HEALTHCARE CONSULTATION
// ======================================================

function updateConsultationChart(
    selectedYear
) {

    let data =
        healthData;


    if (selectedYear !== "all") {

        data =
            healthData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    /*
       Consultation rate is calculated here using
       recent illness as the denominator.

       Example:
       consulted practitioners / recent illness * 100
    */

    const chartData =
        data.map(row => {

            const illness =
                Number(
                    row.recent_illness || 0
                );

            const consulted =
                Number(
                    row.consulted_health_practitioner || 0
                );


            const rate =
                illness > 0
                    ? (
                        consulted /
                        illness
                    ) * 100
                    : 0;


            return {

                year: row.year,

                consulted: consulted,

                illness: illness,

                rate: rate

            };

        });


    const canvas =
        document.getElementById(
            "consultationChart"
        );


    if (consultationChart) {

        consultationChart.destroy();

    }


    consultationChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    chartData.map(
                        row => row.year
                    ),

                datasets: [

                    {
                        label:
                            "Consultation Rate (%)",

                        data:
                            chartData.map(
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

                                    const item =
                                        chartData[
                                            context.dataIndex
                                        ];


                                    return (
                                        item.rate.toFixed(2) +
                                        "% (" +
                                        item.consulted
                                            .toLocaleString() +
                                        " consultations)"
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
                                "Consultation Rate"

                        },

                        ticks: {

                            callback:
                                function(value) {

                                    return value + "%";

                                }

                        }

                    }

                }

            }

        });

}


// ======================================================
// RQ3
// CURRENT NHIS COVERAGE
// ======================================================

function updateInsuranceChart(
    selectedYear
) {

    let data =
        coverageData;


    if (selectedYear !== "all") {

        data =
            coverageData.filter(

                row =>
                    String(row.year) ===
                    selectedYear

            );

    }


    const years = [

        ...new Set(
            data.map(row => row.year)
        )

    ].sort();


    const statuses = [

        ...new Set(
            data.map(
                row =>
                    row.coverage_status
            )
        )

    ];


    /*
       Calculate the percentage of each coverage
       status within each year.
    */

    const datasets =
        statuses.map(status => {

            return {

                label: status,

                data:
                    years.map(year => {

                        const yearRows =
                            data.filter(

                                row =>
                                    String(row.year) ===
                                    String(year)

                            );


                        const yearTotal =
                            yearRows.reduce(

                                (sum, row) =>
                                    sum +
                                    Number(
                                        row.total || 0
                                    ),

                                0

                            );


                        const statusRow =
                            yearRows.find(

                                row =>
                                    row.coverage_status ===
                                    status

                            );


                        const statusTotal =
                            statusRow
                                ? Number(
                                    statusRow.total
                                )
                                : 0;


                        return yearTotal > 0
                            ? (
                                statusTotal /
                                yearTotal
                            ) * 100
                            : 0;

                    })

            };

        });


    const canvas =
        document.getElementById(
            "insuranceChart"
        );


    if (insuranceChart) {

        insuranceChart.destroy();

    }


    insuranceChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: years,

                datasets: datasets

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
                                        context.dataset.label +
                                        ": " +
                                        Number(
                                            context.raw
                                        ).toFixed(2) +
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

                                    return value + "%";

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
// START
// ======================================================

loadHealthData();