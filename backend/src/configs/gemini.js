const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const defaultModel = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

module.exports = { defaultModel };
