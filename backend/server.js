import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { connectDB, getDB } from "./db.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Collection helper
const moods = () => getDB().collection("moods");

// ----------------------
// CREATE
// ----------------------
app.post("/moods", async (req, res) => {
    try {
        const { mood, note, date } = req.body;

        if (!mood || !note || !date) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const result = await moods().insertOne({
            mood,
            note,
            date,
            createdAt: new Date(),
        });

        const newMood = await moods().findOne({
            _id: result.insertedId,
        });

        res.status(201).json(newMood);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------
// READ
// ----------------------
app.get("/moods", async (req, res) => {
    try {
        const data = await moods()
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------
// UPDATE
// ----------------------
app.put("/moods/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        const result = await moods().updateOne(
            { _id: id },
            {
                $set: req.body,
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Mood not found",
            });
        }

        const updated = await moods().findOne({
            _id: id,
        });

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------
// DELETE
// ----------------------
app.delete("/moods/:id", async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);

        const result = await moods().deleteOne({
            _id: id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Mood not found",
            });
        }

        res.json({
            message: "Deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ----------------------
// Start Server
// ----------------------
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

startServer();