import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transactionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect); // all transaction routes require login

router.get("/summary", getSummary);
router.route("/").get(getTransactions).post(addTransaction);
router.delete("/:id", deleteTransaction);

export default router;
