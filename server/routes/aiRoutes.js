import express from "express";
import { aiAddTransaction, aiInsight, aiChat, aiTranscribe } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Accept browser-generated audio regardless of codec parameters
// such as "audio/webm;codecs=opus".
router.post(
  "/transcribe",
  express.raw({ type: "*/*", limit: "25mb" }),
  aiTranscribe
);

router.post("/add", aiAddTransaction);
router.get("/insight", aiInsight);
router.post("/chat", aiChat);

export default router;
