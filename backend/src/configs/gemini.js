const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function connectGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    await model.generateContent("ping");
    console.log("✅ Đã kết nối gemini api thành công!");
  } catch (error) {
    console.error("❌ Kết nối gemini api thất bại:", error.message);
  }
}

connectGemini();

module.exports = genAI;
