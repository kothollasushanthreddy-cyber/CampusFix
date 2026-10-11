

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors({
    origin: [
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ]
}));

app.use(express.json());


let issues = [];
let nextId = 1;

// Backend homepage
app.get("/", function (req, res) {
    res.send("CampusFix backend is running!");
});

// Check whether the API is working
app.get("/api/health", function (req, res) {
    res.json({
        success: true,
        message: "CampusFix API is working!"
    });
});

// Retrieve all issues
app.get("/api/issues", function (req, res) {
    res.json(issues);
});

// Create a new issue
app.post("/api/issues", function (req, res) {
    const { title, category, location, description } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof category !== "string" || !category.trim() ||
        typeof location !== "string" || !location.trim() ||
        typeof description !== "string" || !description.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields."
        });
    }

    const newIssue = {
        id: nextId++,
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        description: description.trim(),
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    issues.push(newIssue);

    res.status(201).json({
        success: true,
        message: "Issue created successfully!",
        issue: newIssue
    });
});

app.listen(PORT, function () {
    console.log(`CampusFix backend running at http://localhost:${PORT}`);
});

