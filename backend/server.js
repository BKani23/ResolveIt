import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./config/db.js";

// load .env variables
dotenv.config();

connectToDB();

const app = express();

app.get("/", (req, res) => {
  res.send("ResolveIt API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
