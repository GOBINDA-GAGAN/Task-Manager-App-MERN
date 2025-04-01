require("dotenv").config();

const dbConnection = require("./config/db");
const cors = require("cors");
const path = require("path");
const express = require("express");

const app = express();

//Middleware to handel cors requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to the database
dbConnection();

// Middleware
app.use(express.json());

//Routers
// app.use("/api/auth",authRoutes);
// app.use("/api/users",userRoutes);
// app.use("/api/task",taskRoutes);
// app.use("/api/reports",reportsRoutes);

//check the router
app.get("/", (req, res) => {
  res.send({
    message: "Task Manager API",
    version: "1.0.0",
    author: "Gobinda Gagan Dey",
    license: "MIT",
  });
});

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
