const API_URL = "http://127.0.0.1:5000";

async function loadOverview() {

    try {

        const response =
            await fetch(`${API_URL}/api/overview`);

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const data =
            await response.json();


        document
            .getElementById("total-records")
            .textContent =
            Number(
                data.total_records
            ).toLocaleString();


        document
            .getElementById("total-households")
            .textContent =
            Number(
                data.total_households
            ).toLocaleString();


        document
            .getElementById("study-period")
            .textContent =
            `${data.start_year} – ${data.end_year}`;

    }

    catch (error) {

        console.error(
            "Could not load overview:",
            error
        );


        document
            .getElementById("total-records")
            .textContent = "Error";


        document
            .getElementById("total-households")
            .textContent = "Error";


        document
            .getElementById("study-period")
            .textContent = "Error";

    }

}


loadOverview();