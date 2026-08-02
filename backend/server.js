const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db/connection");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transactions");
const dashboardRoutes = require("./routes/dashboard");
const transferRoutes = require("./routes/transfers");

const app = express();

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Money Transfer Backend Running",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", require("./routes/profile"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transfers", transferRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});