const express = require("express");
const router = express.Router();
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getCurrentMonthBudgets,
} = require("../controllers/budgetController");

router.get("/current-month", getCurrentMonthBudgets);
router.route("/").get(getBudgets).post(createBudget);
router.route("/:id").get(getBudget).put(updateBudget).delete(deleteBudget);

module.exports = router;
