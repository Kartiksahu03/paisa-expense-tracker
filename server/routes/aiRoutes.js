import express from "express";
import { aiAddTransaction, aiInsight, aiChat } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.post("/add", aiAddTransaction);
router.get("/insight", aiInsight);
router.post("/chat", aiChat);

export default router;
