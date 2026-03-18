const Category = require("../models/Categories");

const VALID_TYPES = ["income", "expense"];

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: "Please provide name and type" });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: "Type must be income or expense" });
    }
    const newCategory = await Category.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: "Category creation failed" });
  }
};
