const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// ---------------------------------------------------------------
// MODEL
// ---------------------------------------------------------------
const mongoose = require("mongoose");
const Mood = mongoose.model("Mood", {
    mood: String,
    note: String,
    date: String,
});

// ---------------------------------------------------------------
// ROUTES (CRUD)
// ---------------------------------------------------------------

// CREATE — add a new mood
app.post("/moods", async (req, res) => {
    try {
        const data = await Mood.create(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ — get all moods
app.get("/moods", async (req, res) => {
    try {
        const data = await Mood.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE — edit a mood by id
app.put("/moods/:id", async (req, res) => {
    try {
        await Mood.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE — remove a mood by id
app.delete("/moods/:id", async (req, res) => {
    try {
        await Mood.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ---------------------------------------------------------------
// START SERVER
// ---------------------------------------------------------------
app.listen(5000, () => console.log("Server running on port 5000"));
