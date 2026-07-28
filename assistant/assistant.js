// =========================================
// AHIES Research Assistant
// =========================================

// =========================================
// Configuration
// =========================================

const API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:5000"
        : "https://ahies-research-api-enfbb7htfsacf3g7.spaincentral-01.azurewebsites.net";

const CHAT_API = `${API_BASE}/api/chat`;
const KNOWLEDGE_API = `${API_BASE}/api/knowledge`;
let KNOWLEDGE = {};
// =========================================
// Load Knowledge
// =========================================

async function loadKnowledge() {

    if (Object.keys(KNOWLEDGE).length > 0) return;

    try {

        const response = await fetch(KNOWLEDGE_API);

        if (!response.ok) {
            throw new Error("Unable to load knowledge.");
        }

        KNOWLEDGE = await response.json();

    }

    catch (error) {

        console.error(error);

        assistantContent.innerHTML = `
            <p>Unable to load the Research Assistant.</p>
        `;

    }

}


// =========================================
// Build Assistant
// =========================================

document.body.insertAdjacentHTML(
    "beforeend",
`
<div id="assistant-widget">

    <button id="assistant-toggle">
        🤖
    </button>

    <div id="assistant-window">

        <div class="assistant-header">

            <h3>AHIES Research Assistant</h3>

            <button id="assistant-close">
                ✕
            </button>

        </div>

        <div id="assistant-content"></div>

    </div>

</div>
`
);


// =========================================
// Elements
// =========================================

const assistantWindow =
    document.getElementById("assistant-window");

const assistantToggle =
    document.getElementById("assistant-toggle");

const assistantClose =
    document.getElementById("assistant-close");

const assistantContent =
    document.getElementById("assistant-content");


// =========================================
// Open / Close
// =========================================

assistantToggle.onclick = async () => {

    assistantWindow.style.display = "flex";

    assistantToggle.style.display = "none";

    await loadKnowledge();

    showCategories();

};

assistantClose.onclick = () => {

    assistantWindow.style.display = "none";

    assistantToggle.style.display = "block";

};


// =========================================
// Categories
// =========================================

function showCategories() {

    assistantContent.innerHTML = `
        <div class="assistant-body">

            <h4>Welcome</h4>

            <p>Select a research area below.</p>

        </div>
    `;

    Object.entries(KNOWLEDGE).forEach(([category, section]) => {

        const button = document.createElement("button");

        button.className = "assistant-option";

        button.textContent = section.title;

        button.onclick = () => {

            showQuestions(category);

        };

        assistantContent.appendChild(button);

    });

}


// =========================================
// Questions
// =========================================

function showQuestions(category) {

    const section = KNOWLEDGE[category];

    assistantContent.innerHTML = "";

    const back = document.createElement("button");

    back.className = "assistant-back";

    back.textContent = "← Back";

    back.onclick = showCategories;

    assistantContent.appendChild(back);

    const heading = document.createElement("h4");

    heading.textContent = section.title;

    assistantContent.appendChild(heading);

    section.questions.forEach(question => {

        const button = document.createElement("button");

        button.className = "assistant-option";

        button.textContent = question;

        button.onclick = () => {

            getAnswer(category, question);

        };

        assistantContent.appendChild(button);

    });

}


// =========================================
// Answer
// =========================================

async function getAnswer(category, question) {

    assistantContent.innerHTML = `
        <button class="assistant-back">
            ← Back
        </button>

        <h4>${question}</h4>

        <p>Loading...</p>
    `;

    document.querySelector(".assistant-back").onclick =
        () => showQuestions(category);

    try {

        const response = await fetch(CHAT_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                category,

                question

            })

        });

        if (!response.ok) {

            throw new Error("API Error");

        }

        const data = await response.json();

        assistantContent.innerHTML = `
            <button class="assistant-back">
                ← Back
            </button>

            <h4>${question}</h4>

            <div class="assistant-answer">

                ${data.response}

            </div>
        `;

        document.querySelector(".assistant-back").onclick =
            () => showQuestions(category);

    }

    catch (error) {

        console.error(error);

        assistantContent.innerHTML = `
            <button class="assistant-back">
                ← Back
            </button>

            <p>Unable to retrieve the answer.</p>
        `;

        document.querySelector(".assistant-back").onclick =
            () => showQuestions(category);

    }

}