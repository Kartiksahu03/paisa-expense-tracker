import express from "express";
import { setBudget, getBudget } from "../controllers/budgetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.route("/").get(getBudget).put(setBudget);

export default router;
