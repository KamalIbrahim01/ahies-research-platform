// ======================================================
// AHIES LABOUR RESEARCH
// labour.js
// ======================================================


// ======================================================
// API CONFIGURATION
// ======================================================

const BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://ahies-research-api-enfbb7htfsacf3g7.spaincentral-01.azurewebsites.net";

const LABOUR_API = `${BASE_URL}/api/labour`;


// ======================================================
// DATA
// ======================================================

let labourData = [];

let labourChart;
let employmentChart;
let jobSearchChart;
let socialSecurityChart;
let trendChart;


// ======================================================
// RESEARCH FINDINGS
// ======================================================

// RQ1 Employment Participation

const employmentResearch = [

    { year: 2022, worked: 15442 },

    { year: 2023, worked: 14882 },

    { year: 2024, worked: 14723 }

];


// RQ2 Job Seeking

const jobSearchResearch = [

    { year: 2022, looking: 1743 },

    { year: 2023, looking: 2226 },

    { year: 2024, looking: 2333 }

];


// RQ3 Social Security

const socialSecurityResearch = [

    { year: 2022, covered: 5330 },

    { year: 2023, covered: 5787 },

    { year: 2024, covered: 2767 }

];


// ======================================================
// LOAD LABOUR DATA
// ======================================================

async function loadLabourData() {

    try {

        const response = await fetch(LABOUR_API);

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }

        labourData = await response.json();

        console.log(
            "Labour Overview:",
            labourData
        );

        updatePage("all");

    }

    catch(error){

        console.error(
            "Labour API Error:",
            error
        );

    }

}


// ======================================================
// UPDATE PAGE
// ======================================================

function updatePage(selectedYear){

    let filteredData;

    if(selectedYear==="all"){

        filteredData=labourData;

    }

    else{

        filteredData=labourData.filter(

            row=>String(row.year)===selectedYear

        );

    }

    updateIndicators(filteredData);

    updateTable(filteredData);

    updateChart(filteredData);

    updateEmploymentChart(selectedYear);

    updateJobSearchChart(selectedYear);

    updateSocialSecurityChart(selectedYear);

    updateTrendChart(selectedYear);

}


// ======================================================
// INDICATOR CARDS
// ======================================================

function updateIndicators(data){

    const totalRecords=data.reduce(

        (sum,row)=>

            sum+Number(
                row.total_records||0
            ),

        0

    );

    const worked=data.reduce(

        (sum,row)=>

            sum+Number(
                row.worked_for_pay||0
            ),

        0

    );

    const looking=data.reduce(

        (sum,row)=>

            sum+Number(
                row.actively_looking_for_work||0
            ),

        0

    );

    const social=data.reduce(

        (sum,row)=>

            sum+Number(
                row.social_security||0
            ),

        0

    );

    document
        .getElementById(
            "total-records"
        )
        .textContent=
        totalRecords.toLocaleString();

    document
        .getElementById(
            "worked-for-pay"
        )
        .textContent=
        worked.toLocaleString();

    document
        .getElementById(
            "looking-for-work"
        )
        .textContent=
        looking.toLocaleString();

    document
        .getElementById(
            "social-security"
        )
        .textContent=
        social.toLocaleString();

}


// ======================================================
// DATA TABLE
// ======================================================

function updateTable(data){

    const tableBody=document.getElementById(
        "labour-table"
    );

    tableBody.innerHTML="";

    data.forEach(row=>{

        const tableRow=document.createElement(
            "tr"
        );

        tableRow.innerHTML=`

            <td>${row.year}</td>

            <td>${Number(row.total_records).toLocaleString()}</td>

            <td>${Number(row.worked_for_pay).toLocaleString()}</td>

            <td>${Number(row.actively_looking_for_work).toLocaleString()}</td>

            <td>${Number(row.social_security).toLocaleString()}</td>

        `;

        tableBody.appendChild(tableRow);

    });

}
// ======================================================
// OVERVIEW LABOUR CHART
// ======================================================

function updateChart(data) {

    const canvas =
        document.getElementById(
            "labourChart"
        );

    if (labourChart) {

        labourChart.destroy();

    }

    labourChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    data.map(
                        row => row.year
                    ),

                datasets: [

                    {
                        label: "Worked for Pay",

                        data:
                            data.map(
                                row => Number(row.worked_for_pay)
                            )

                    },

                    {
                        label: "Looking for Work",

                        data:
                            data.map(
                                row => Number(row.actively_looking_for_work)
                            )

                    },

                    {
                        label: "Social Security",

                        data:
                            data.map(
                                row => Number(row.social_security)
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
// RQ1
// EMPLOYMENT PARTICIPATION
// ======================================================

function updateEmploymentChart(selectedYear){

    let data = employmentResearch;

    if(selectedYear!=="all"){

        data = employmentResearch.filter(

            row=>String(row.year)===selectedYear

        );

    }

    const canvas=document.getElementById(
        "employmentStatusChart"
    );

    if(employmentChart){

        employmentChart.destroy();

    }

    employmentChart=new Chart(canvas,{

        type:"line",

        data:{

            labels:data.map(row=>row.year),

            datasets:[{

                label:"Worked for Pay",

                data:data.map(row=>row.worked),

                tension:0.3,

                pointRadius:6

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}



// ======================================================
// RQ2
// JOB SEEKING
// ======================================================

function updateJobSearchChart(selectedYear){

    let data=jobSearchResearch;

    if(selectedYear!=="all"){

        data=jobSearchResearch.filter(

            row=>String(row.year)===selectedYear

        );

    }

    const canvas=document.getElementById(
        "employmentSectorChart"
    );

    if(jobSearchChart){

        jobSearchChart.destroy();

    }

    jobSearchChart=new Chart(canvas,{

        type:"bar",

        data:{

            labels:data.map(row=>row.year),

            datasets:[{

                label:"Looking for Work",

                data:data.map(row=>row.looking)

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{
                    display:false
                }

            },

            scales:{

                y:{
                    beginAtZero:true
                }

            }

        }

    });

}



// ======================================================
// RQ3
// SOCIAL SECURITY
// ======================================================

function updateSocialSecurityChart(selectedYear){

    let data=socialSecurityResearch;

    if(selectedYear!=="all"){

        data=socialSecurityResearch.filter(

            row=>String(row.year)===selectedYear

        );

    }

    const canvas=document.getElementById(
        "occupationChart"
    );

    if(socialSecurityChart){

        socialSecurityChart.destroy();

    }

    socialSecurityChart=new Chart(canvas,{

        type:"line",

        data:{

            labels:data.map(row=>row.year),

            datasets:[{

                label:"Covered by Social Security",

                data:data.map(row=>row.covered),

                tension:0.3,

                pointRadius:6

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}



// ======================================================
// RQ4
// EMPLOYMENT TREND
// ======================================================

function updateTrendChart(selectedYear){

    let data=labourData;

    if(selectedYear!=="all"){

        data=labourData.filter(

            row=>String(row.year)===selectedYear

        );

    }

    const canvas=document.getElementById(
        "employmentBenefitsChart"
    );

    if(trendChart){

        trendChart.destroy();

    }

    trendChart=new Chart(canvas,{

        type:"bar",

        data:{

            labels:data.map(row=>row.year),

            datasets:[

                {

                    label:"Worked for Pay",

                    data:data.map(

                        row=>Number(row.worked_for_pay)

                    )

                },

                {

                    label:"Social Security",

                    data:data.map(

                        row=>Number(row.social_security)

                    )

                }

            ]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"top"

                }

            },

            scales:{

                y:{

                    beginAtZero:true

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
        function () {

            updatePage(
                this.value
            );

        }
    );


// ======================================================
// START PAGE
// ======================================================

loadLabourData();