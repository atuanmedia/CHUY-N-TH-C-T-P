const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();
connectDB();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/apartments", require("./src/routes/apartment.routes"));
app.use("/api/residents", require("./src/routes/resident.routes"));
app.use("/api/services", require("./src/routes/service.routes"));
app.use("/api/invoices", require("./src/routes/invoice.routes"));
app.use("/api/payments", require("./src/routes/payment.routes"));
app.use("/api/tickets", require("./src/routes/ticket.routes"));
app.use("/api/notices", require("./src/routes/notice.routes"));
app.use("/api/logs", require("./src/routes/auditlog.routes"));
app.use("/api/reports", require("./src/routes/report.routes"));
app.use("/api/reports", require("./src/routes/report.routes"));


app.get("/", (req, res) => res.send("API running..."));

module.exports = app;
