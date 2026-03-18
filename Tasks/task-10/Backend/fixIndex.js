require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log("Connected to MongoDB");
  try {
    await mongoose.connection.collection("budgets").dropIndex("userId_1_category_1_month_1");
    console.log("✅ Old index dropped successfully");
  } catch (e) {
    console.log("⚠️  Index may not exist:", e.message);
  }
  await mongoose.connection.close();
  console.log("Done. You can now restart your backend.");
  process.exit(0);
});
