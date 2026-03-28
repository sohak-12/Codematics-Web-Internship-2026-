const supabase = require("../config/supabase");

async function generateFeedbackFromGemini(category, transcript) {
  const formatted = transcript
    .map((t, i) => `Q${i + 1}: ${t.question}\nA${i + 1}: ${t.answer}`)
    .join("\n\n");

  const prompt = `You are a supportive and encouraging interview coach. Analyze this ${category} interview transcript and provide GENEROUS, MOTIVATING feedback. You believe in the candidate's potential and want to boost their confidence.

IMPORTANT SCORING GUIDELINES:
- Be generous with scores. Most scores should be between 7-10.
- If the candidate showed ANY effort or knowledge, give at least 7.
- If they answered reasonably well, give 8-9.
- If they did great, give 10.
- Minimum score should be 5 even for weak answers (they showed up and tried!).
- Focus on what they did RIGHT in strengths.
- Frame weaknesses as "areas to grow" not failures.
- Suggestions should be actionable and encouraging.
- Summary should be positive and motivating.

Return ONLY valid JSON with these EXACT keys:
{
  "overallScore": number (5-10, be generous),
  "communication": number (5-10, be generous),
  "technicalKnowledge": number (5-10, be generous),
  "confidence": number (5-10, be generous),
  "problemSolving": number (5-10, be generous),
  "strengths": string[] (3-5 items, highlight positives),
  "weaknesses": string[] (2-3 items, frame as growth areas),
  "suggestions": string[] (3-5 items, actionable & encouraging),
  "summary": string (2-3 sentences, positive & motivating)
}

Transcript:
${formatted}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    }
  );

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  return JSON.parse(text);
}

// POST /api/feedback — Generate feedback and save interview
const createFeedback = async (req, res) => {
  try {
    const { category, transcript } = req.body;
    const userId = req.user.id;

    if (!category || !transcript?.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const feedback = await generateFeedbackFromGemini(category, transcript);

    // Sanitize score — Gemini returns inconsistent keys
    const score = Number(feedback.overallScore ?? feedback.overall_score ?? feedback.score) || 8;

    // Insert interview
    const { data: interview, error: ivError } = await supabase
      .from("interviews")
      .insert({
        user_id: userId,
        category,
        score,
        feedback,
      })
      .select("id")
      .single();

    if (ivError) throw ivError;

    // Insert transcript entries
    const transcriptRows = transcript.map((t) => ({
      interview_id: interview.id,
      question: t.question,
      answer: t.answer,
    }));

    await supabase.from("interview_transcripts").insert(transcriptRows);

    res.json({ interviewId: interview.id, feedback });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal error" });
  }
};

// GET /api/feedback/:id — Get interview feedback by ID
const getFeedback = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: "Interview not found" });
  }
};

module.exports = { createFeedback, getFeedback };
