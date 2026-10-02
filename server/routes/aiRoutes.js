import express from "express";
import { aiAddTransaction, aiInsight, aiChat, aiTranscribe } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.post("/transcribe", express.raw({ type: /^audio\//, limit: "25mb" }), aiTranscribe);\nrouter.post("/add", aiAddTransaction);
router.get("/insight", aiInsight);
router.post("/chat", aiChat);

export default router;
