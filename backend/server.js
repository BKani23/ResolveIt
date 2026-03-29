import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import mongoose from "mongoose";


// load .env variables
dotenv.config();

connectToDB();


// Initialize Express app
const app = express();


const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["road", "water", "electricity", "safety", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved"],
      default: "pending",
    },
    location: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

app.get("/", (req, res) => {
  res.send("ResolveIt API is running...");
});



// Get all issues
app.get("/api/issues", async (req, res) => {
  try {
    const issues = await Issue.find();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new issue
app.post("/api/issues", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
