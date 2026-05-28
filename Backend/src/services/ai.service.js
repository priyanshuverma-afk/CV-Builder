const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

async function generateInterviewReport(resume, selfDescription, jobDescription) {
    const prompt = `Generate an interview report based on the following information:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "object",
                properties: {
                    matchScore: { type: "number" },
                    technicalQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                intention: { type: "string" },
                                answer: { type: "string" },
                            }
                        }
                    },
                    behaviouralQuestions: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                question: { type: "string" },
                                intention: { type: "string" },
                                answer: { type: "string" },
                            }
                        }
                    },
                    skillGaps: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                skill: { type: "string" },
                                severity: {
                                    type: "string",
                                    enum: ["Low", "Medium", "High"]
                                },
                            }
                        }
                    },
                    preparationPlan: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                day: { type: "number" },
                                focus: { type: "string" },
                                tasks: {
                                    type: "array",
                                    items: { type: "string" }
                                },
                            }
                        }
                    },
                }
            },
        }
    });

return JSON.parse(response.text)
}

module.exports = { generateInterviewReport };