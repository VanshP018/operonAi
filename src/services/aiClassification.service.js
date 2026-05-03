import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const allowedCategories = new Set([
  "billing_duplicate",
  "billing_other",
  "other",
]);

export const classifyMessageAI = async (message) => {
  if (!client || !message) {
    return { category: "other" };
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: [
        "You are a strict classifier.",
        "",
        "Classify the user message into ONE of these categories:",
        "- billing_duplicate",
        "- billing_other",
        "- other",
        "",
        "Rules:",
        "- \"billing_duplicate\" -> user mentions being charged twice / duplicate payment",
        "- \"billing_other\" -> general billing/refund/payment issues",
        "- \"other\" -> everything else",
        "",
        "Return ONLY valid JSON:",
        '{ "category": "<value>" }',
      ].join("\n"),
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const response = await model.generateContent(message);
    const content = response?.response?.text() || "";
    const parsed = JSON.parse(content);
    const category = String(parsed?.category || "").toLowerCase().trim();

    if (allowedCategories.has(category)) {
      return { category };
    }

    return { category: "other" };
  } catch (error) {
    console.error("AI classification error:", error?.message || error);
    return { category: "other" };
  }
};
