
const issueForm = document.getElementById("issueForm");
const issueResult = document.getElementById("issueResult");

const dashboard = document.createElement("section");
dashboard.className = "dashboard";
issueResult.after(dashboard);

const issueList = document.createElement("section");
issueList.className = "issue-list";
dashboard.after(issueList);

let issues = JSON.parse(
    localStorage.getItem("campusFixIssues") || "[]"
);

// Add IDs and timestamps to older reports if they don't have them.
issues.forEach(function (issue) {
    if (!issue.id) {
        issue.id = "CF-" + Date.now() + "-" +
            Math.random().toString(36).slice(2, 7);
    }

    if (!issue.createdAt) {
        issue.createdAt = new Date().toISOString();
    }

    if (!issue.status) {
        issue.status = "Pending";
    }
});

function saveIssues() {
    localStorage.setItem("campusFixIssues", JSON.stringify(issues));
}

function displayDashboard() {
    dashboard.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Issue Dashboard";
    dashboard.appendChild(heading);

    const summary = document.createElement("div");
    summary.className = "summary-grid";

    const counts = [
        { label: "Total Issues", value: issues.length },
        {
            label: "Pending",
            value: issues.filter(issue => issue.status === "Pending").length
        },
        {
            label: "In Progress",
            value: issues.filter(issue => issue.status === "In Progress").length
        },
        {
            label: "Resolved",
            value: issues.filter(issue => issue.status === "Resolved").length
        }
    ];

    counts.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "summary-card";

        const number = document.createElement("h3");
        number.textContent = item.value;

        const label = document.createElement("p");
        label.textContent = item.label;

        card.append(number, label);
        summary.appendChild(card);
    });

    dashboard.appendChild(summary);
}

function displayIssues() {
    issueList.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Reported Issues";
    issueList.appendChild(heading);

    if (issues.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No issues reported yet.";
        issueList.appendChild(message);
        return;
    }

    issues.forEach(function (issue, index) {
        const card = document.createElement("article");
        card.className = "issue-card";

        const title = document.createElement("h3");
        title.textContent = issue.title;

        const id = document.createElement("p");
        id.textContent = "Issue ID: " + issue.id;

        const category = document.createElement("p");
        category.textContent = "Category: " + issue.category;

        const location = document.createElement("p");
        location.textContent = "Location: " + issue.location;

        const description = document.createElement("p");
        description.textContent = "Description: " + issue.description;

        const date = document.createElement("p");
        date.textContent = "Reported: " +
            new Date(issue.createdAt).toLocaleString();

        const statusLabel = document.createElement("label");
        statusLabel.textContent = "Status: ";

        const statusSelect = document.createElement("select");
        statusSelect.setAttribute("aria-label", "Status for " + issue.title);

        ["Pending", "In Progress", "Resolved"].forEach(function (status) {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            statusSelect.appendChild(option);
        });

        statusSelect.value = issue.status;

        statusSelect.addEventListener("change", function () {
            issues[index].status = statusSelect.value;
            saveIssues();
            displayDashboard();
            displayIssues();
        });

        statusLabel.appendChild(statusSelect);

        card.append(
            title, id, category, location, description, date, statusLabel
        );

        issueList.appendChild(card);
    });
}

issueForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !category || !location || !description) {
        issueResult.textContent = "Please fill in all fields.";
        return;
    }

    const newIssue = {
        id: "CF-" + Date.now(),
        title: title,
        category: category,
        location: location,
        description: description,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    issues.unshift(newIssue);
    saveIssues();

    issueResult.textContent = "Issue submitted successfully!";
    issueForm.reset();

    displayDashboard();
    displayIssues();
});

saveIssues();
displayDashboard();
displayIssues();


