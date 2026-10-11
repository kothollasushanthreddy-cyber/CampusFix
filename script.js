

const issueForm = document.getElementById("issueForm");
const issueResult = document.getElementById("issueResult");

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

    issueResult.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = "Issue submitted successfully!";

    const reportTitle = document.createElement("p");
    reportTitle.textContent = "Title: " + title;

    const reportCategory = document.createElement("p");
    reportCategory.textContent = "Category: " + category;

    const reportLocation = document.createElement("p");
    reportLocation.textContent = "Location: " + location;

    const reportDescription = document.createElement("p");
    reportDescription.textContent = "Description: " + description;

    issueResult.append(
        heading,
        reportTitle,
        reportCategory,
        reportLocation,
        reportDescription
    );

    issueForm.reset();
});

