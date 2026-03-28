const supabase = require("../config/supabase");

// GET /api/interviews — Get user's interview history
const getUserInterviews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("id, category, score, created_at")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/interviews/admin/stats — Admin stats
const getAdminStats = async (req, res) => {
  try {
    const { count: totalInterviews } = await supabase
      .from("interviews")
      .select("*", { count: "exact", head: true });

    const { data: allInterviews } = await supabase
      .from("interviews")
      .select("category, score, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const scores = allInterviews?.map((i) => i.score) || [];
    const avg = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : "0";

    const catCount = {};
    allInterviews?.forEach((i) => {
      catCount[i.category] = (catCount[i.category] || 0) + 1;
    });
    const topCategory =
      Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    res.json({
      totalInterviews: totalInterviews || 0,
      avgScore: avg,
      topCategory,
      recentInterviews: allInterviews || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserInterviews, getAdminStats };
