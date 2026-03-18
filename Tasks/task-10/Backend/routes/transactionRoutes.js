const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getStats,
} = require("../controllers/transactionController");

router.route("/").get(getTransactions).post(createTransaction);
router.route("/stats").get(getStats);
router.route("/:id").get(getTransaction).put(updateTransaction).delete(deleteTransaction);

module.exports = router;

