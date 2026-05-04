import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const client = apiKey ? new GoogleGenerativeAI(apiKey) : null;


export const getEmbedding = async (text) => {
  if (!client || !text) {
    return null;
  }

  try {
    const model = client.getGenerativeModel({
      model: "gemini-embedding-001",
    });

    const response = await model.embedContent(text);
    const values = response?.embedding?.values;

    return Array.isArray(values) ? values : null;
  } catch (error) {
    console.error("Embedding error:", error?.message || error);
    return null;
  }
};

export const normalize = (text) => {
  if (!text) {
    return "";
  }

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return -1;
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const valueA = a[i];
    const valueB = b[i];

    dot += valueA * valueB;
    magA += valueA * valueA;
    magB += valueB * valueB;
  }

  if (magA === 0 || magB === 0) {
    return -1;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

export const initializeFaqEmbeddings = async () => {
  for (const faq of faqs) {
    const embedding = await getEmbedding(normalize(faq.question));
    faq.embedding = embedding;
  }
};

export const retrieveFAQ = async (
  message,
  classification,
  faqs,
  threshold = 0.8,
) => {
  const normalizedMessage = normalize(message);
  const userVector = await getEmbedding(normalizedMessage);

  if (!userVector) {
    return { matched: false };
  }

  const filteredFaqs = Array.isArray(faqs)
    ? faqs.filter((faq) => faq.category === classification?.category)
    : [];

  const scoredFaqs = filteredFaqs
    .filter((faq) => Array.isArray(faq.embedding))
    .map((faq) => ({
      ...faq,
      score: cosineSimilarity(userVector, faq.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const bestMatch = scoredFaqs[0];

  console.log({
    message: normalizedMessage,
    matchedFAQ: bestMatch?.question,
    score: bestMatch?.score,
  });

  if (!bestMatch || bestMatch.score < threshold) {
    return { matched: false };
  }

  return {
    matched: true,
    faq: {
      id: bestMatch.id,
      question: bestMatch.question,
      action: bestMatch.action,
      category: bestMatch.category,
    },
    score: bestMatch.score,
  };
};
