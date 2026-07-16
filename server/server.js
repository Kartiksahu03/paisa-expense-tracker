import "dotenv/config"; // MUST be first: loads .env before any other module reads it
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.json({ status: "Paisa API running" }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
