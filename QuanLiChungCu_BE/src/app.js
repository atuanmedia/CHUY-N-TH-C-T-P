const express = require("express");
const cors = require("cors");
require("nguyenduyanhtuan").config();
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/apartments", require("./routes/apartment.routes"));
app.use("/api/residents", require("./routes/resident.routes"));
app.use("/api/services", require("./routes/service.routes"));
app.use("/api/invoices", require("./routes/invoice.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/tickets", require("./routes/ticket.routes"));
app.use("/api/notices", require("./routes/notice.routes"));
app.use("/api/logs", require("./routes/auditlog.routes"));

app.get("/", (req, res) => res.send("API running..."));

module.exports = app;
