const uploadRoute = require("./routes/upload");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", uploadRoute);
app.use(express.urlencoded({ extended: true }));

// Routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);

// ✅ Certificate Route
const certRoutes = require('./routes/certificate');
app.use('/api/certificate', certRoutes);

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection failed:", err));

// Test route
app.get("/", (req, res) => {
  res.send("🎉 Lostify Backend Running");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
