

const API_URL = "http://localhost:3000/api/issues";

const issueForm = document.getElementById("issueForm");
const issueResult = document.getElementById("issueResult");

const dashboard = document.createElement("section");
dashboard.className = "dashboard";
issueResult.after(dashboard);

const issueList = document.createElement("section");
issueList.className = "issue-list";
dashboard.after(issueList);

let issues = [];

function createTextElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function displayDashboard() {
    dashboard.replaceChildren();

    dashboard.appendChild(createTextElement("h2", "Issue Dashboard"));

    const summary = document.createElement("div");
    summary.className = "summary-grid";

    const counts = [
        ["Total Issues", issues.length],
        ["Pending", issues.filter(i => i.status === "Pending").length],
        ["In Progress", issues.filter(i => i.status === "In Progress").length],
        ["Resolved", issues.filter(i => i.status === "Resolved").length]
    ];

    counts.forEach(function ([label, count]) {
        const card = document.createElement("div");
        card.className = "summary-card";
        card.append(
            createTextElement("h3", count),
            createTextElement("p", label)
        );
        summary.appendChild(card);
    });

    dashboard.appendChild(summary);
}

function displayIssues() {
    issueList.replaceChildren();
    issueList.appendChild(createTextElement("h2", "Reported Issues"));

    if (issues.length === 0) {
        issueList.appendChild(
            createTextElement("p", "No issues reported yet.")
        );
        return;
    }

    issues.forEach(function (issue) {
        const card = document.createElement("article");
        card.className = "issue-card";

        card.append(
            createTextElement("h3", issue.title),
            createTextElement("p", "Issue ID: " + issue.id),
            createTextElement("p", "Category: " + issue.category),
            createTextElement("p", "Location: " + issue.location),
            createTextElement("p", "Description: " + issue.description),
            createTextElement(
                "p",
                "Reported: " + new Date(issue.createdAt).toLocaleString()
            ),
            createTextElement("p", "Status: " + issue.status)
        );

        issueList.appendChild(card);
    });
}

async function loadIssues() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load issues.");
        }

        issues = await response.json();
        displayDashboard();
        displayIssues();
    } catch (error) {
        issueResult.textContent =
            "Unable to load issues. Check that the backend is running.";
    }
}

issueForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !category || !location || !description) {
        issueResult.textContent = "Please fill in all fields.";
        return;
    }

    const submitButton = issueForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    issueResult.textContent = "Submitting issue...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                category,
                location,
                description
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to submit issue.");
        }

        issueResult.textContent = "Issue submitted successfully!";
        issueForm.reset();

        await loadIssues();
    } catch (error) {
        issueResult.textContent =
            error.message === "Failed to fetch"
                ? "Cannot reach the backend. Make sure the server is running."
                : error.message;
    } finally {
        submitButton.disabled = false;
    }
});

loadIssues();
