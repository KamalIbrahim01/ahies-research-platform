const LABOUR_API =
    "http://127.0.0.1:5000/api/labour";


let labourData = [];
let labourChart;


// ======================================================
// LOAD LABOUR DATA
// ======================================================

async function loadLabourData() {

    try {

        const response = await fetch(LABOUR_API);

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        labourData = await response.json();

        console.log(
            "Labour data:",
            labourData
        );

        updatePage("all");

    } catch (error) {

        console.error(
            "Labour API error:",
            error
        );

    }

}


// ======================================================
// UPDATE PAGE
// ======================================================

function updatePage(selectedYear) {

    let filteredData;

    if (selectedYear === "all") {

        filteredData = labourData;

    } else {

        filteredData = labourData.filter(
            row =>
                String(row.year) === selectedYear
        );

    }

    updateIndicators(filteredData);
    updateTable(filteredData);
    updateChart(filteredData);

}


// ======================================================
// INDICATOR CARDS
// ======================================================

function updateIndicators(data) {

    const totalRecords = data.reduce(
        (sum, row) =>
            sum + Number(row.total_records || 0),
        0
    );

    const workedForPay = data.reduce(
        (sum, row) =>
            sum + Number(row.worked_for_pay || 0),
        0
    );

    const lookingForWork = data.reduce(
        (sum, row) =>
            sum + Number(
                row.actively_looking_for_work || 0
            ),
        0
    );

    const socialSecurity = data.reduce(
        (sum, row) =>
            sum + Number(row.social_security || 0),
        0
    );


    document
        .getElementById("total-records")
        .textContent =
        totalRecords.toLocaleString();


    document
        .getElementById("worked-for-pay")
        .textContent =
        workedForPay.toLocaleString();


    document
        .getElementById("looking-for-work")
        .textContent =
        lookingForWork.toLocaleString();


    document
        .getElementById("social-security")
        .textContent =
        socialSecurity.toLocaleString();

}


// ======================================================
// TABLE
// ======================================================

function updateTable(data) {

    const tableBody =
        document.getElementById("labour-table");

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
                    row.worked_for_pay
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.actively_looking_for_work
                ).toLocaleString()}
            </td>

            <td>
                ${Number(
                    row.social_security
                ).toLocaleString()}
            </td>

        `;

        tableBody.appendChild(tableRow);

    });

}


// ======================================================
// LABOUR TREND CHART
// ======================================================

function updateChart(data) {

    const canvas =
        document.getElementById("labourChart");


    if (labourChart) {
        labourChart.destroy();
    }


    labourChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels:
                data.map(row => row.year),

            datasets: [

                {
                    label: "Worked for Pay",

                    data:
                        data.map(
                            row =>
                                Number(
                                    row.worked_for_pay
                                )
                        )
                },

                {
                    label: "Actively Looking for Work",

                    data:
                        data.map(
                            row =>
                                Number(
                                    row.actively_looking_for_work
                                )
                        )
                },

                {
                    label: "Social Security",

                    data:
                        data.map(
                            row =>
                                Number(
                                    row.social_security
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
                },

                tooltip: {

                    callbacks: {

                        label: function(context) {

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
                        text: "Number of Respondents"
                    },

                    ticks: {

                        callback: function(value) {
                            return value.toLocaleString();
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
    .getElementById("year-filter")
    .addEventListener(
        "change",
        function() {

            updatePage(this.value);

        }
    );


// ======================================================
// START
// ======================================================

loadLabourData();