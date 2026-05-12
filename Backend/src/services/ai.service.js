const { GoogleGenai } = require("@google/genai")

const ai = new GoogleGenai({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


async function invokeGemniAi(){
    const response = await ai.models.generateContent({
    mode: "gemini-2.5-flash",
    contents: "Hello gemini! Explain what is Interview?"
})
    console.log(response.text)
}

module.exports = invokeGemniAi

