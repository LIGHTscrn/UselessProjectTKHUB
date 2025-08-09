require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const objectRoutes = require("./routes/objectRoutes");

const app = express();

// allow JSON bodies
app.use(express.json());

// allow CORS from dev frontend (Vite default port 5173)
// change/remove origin in production or make it configurable
app.use(cors({ origin: "http://localhost:5173" }));

// API routes
app.use("/api/upload", uploadRoutes);
app.use("/api/objects", objectRoutes);

// If frontend is built into ../frontend/dist, serve it
const distPath = path.join(__dirname, "../../frontend/dist");
const fs = require("fs");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
