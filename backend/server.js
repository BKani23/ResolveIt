import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";
import mongoose from "mongoose";

// load .env variables
dotenv.config();

connectToDB();


// Initialize Express app
const app = express();


// to parse JSON bodies
app.use(express.json()); 

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

const Issue = mongoose.model("Issue", issueSchema, "Issues");

// Create a new issue
app.post("/api/issues", async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Root route 
app.get("/", (req, res) => {
  res.status(200).json({ message: "ResolveIT Main Route" });
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


// Update issue status

app.put("/api/issues/:id/status", async (req, res) => {

  const { id } = req.params;
  const { status } = req.body;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid issue ID" });
  }

  // Validate status value
  const allowedStatuses = ["pending", "in-progress", "resolved"];

  if (!allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: `Status must be one of: ${allowedStatuses.join(", ")}` });
  }

  try {

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    res.json({ message: "Issue status updated successfully", issue });

  } catch (error) {

    res.status(500).json({ message: error.message });
    
  }
});

// Delete an issue
app.delete("/api/issues/:id", async (req, res) => {

  const { id } = req.params;

  // Check if ID is valid
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid issue ID" });
  }

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
