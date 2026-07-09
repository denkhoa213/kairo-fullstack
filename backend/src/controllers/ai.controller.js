import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Build the prompt for flashcard generation.
 */
function buildPrompt({ topic, text, language, count, level }) {
  const langMap = { vi: "Vietnamese", en: "English", ja: "Japanese", ko: "Korean" };
  const targetLang = langMap[language] || "Vietnamese";
  const levelMap = { beginner: "basic", intermediate: "intermediate", advanced: "advanced" };
  const targetLevel = levelMap[level] || "intermediate";

  if (text) {
    return `You are an expert flashcard creator. Extract the ${count} most important key concepts from the following text and create flashcards.
The flashcards should be in ${targetLang} at ${targetLevel} level.

TEXT:
${text.slice(0, 3000)}

Return ONLY a valid JSON array (no markdown, no code blocks, no extra text) in this exact format:
[
  { "front": "term or question", "back": "definition or answer" },
  ...
]`;
  }

  return `You are an expert flashcard creator. Generate ${count} high-quality flashcards about the topic: "${topic}".
The flashcards should be in ${targetLang} at ${targetLevel} level.

Guidelines:
- Front: A clear term, word, or question
- Back: A concise, accurate definition or answer
- Make them educational and memorable

Return ONLY a valid JSON array (no markdown, no code blocks, no extra text) in this exact format:
[
  { "front": "term or question", "back": "definition or answer" },
  ...
]`;
}

/**
 * Parse the AI response text into an array of {front, back} objects.
 */
function parseCards(text) {
  // Strip markdown code blocks if present
  const clean = text.replace(/```json?/gi, "").replace(/```/g, "").trim();

  // Find first [ and last ]
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array found in response");

  const json = clean.slice(start, end + 1);
  const parsed = JSON.parse(json);

  if (!Array.isArray(parsed)) throw new Error("Response is not an array");

  return parsed
    .filter((c) => c.front && c.back)
    .map((c) => ({ front: String(c.front).trim(), back: String(c.back).trim() }));
}

// @desc    Generate flashcards using Gemini AI
// @route   POST /api/ai/generate
// @access  Private
export const generateFlashcards = async (req, res, next) => {
  try {
    const { topic, text, language = "vi", count = 20, level = "intermediate" } = req.body;

    if (!topic && !text) {
      return res.status(400).json({ message: "Vui lòng cung cấp topic hoặc text" });
    }

    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        message: "AI service chưa được cấu hình. Vui lòng thêm GEMINI_API_KEY vào .env",
      });
    }

    const safeCount = Math.min(Math.max(Number(count) || 20, 5), 50);
    const prompt = buildPrompt({ topic, text, language, count: safeCount, level });

    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      console.error("Gemini API error:", errBody);
      return res.status(502).json({ message: "Lỗi kết nối AI, thử lại sau" });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(502).json({ message: "AI không trả về kết quả" });
    }

    const cards = parseCards(rawText);

    return res.status(200).json({
      success: true,
      data: {
        cards,
        model: "gemini-1.5-flash",
        totalGenerated: cards.length,
      },
    });
  } catch (error) {
    console.error("AI generate error:", error);
    next(error);
  }
};
