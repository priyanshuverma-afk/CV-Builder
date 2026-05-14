const { GoogleGenerativeAI } = require("@google/generative-ai");
const {z} = require("zod");
const{zod-to-json-schema} = require("zod-to-json-schema");

const ai = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash",
});

async function generateInterviewReport(resume,selfDescription,jobDescription) {
    
}

module.exports = invokeGeminiAi;