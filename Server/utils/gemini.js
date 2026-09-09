import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generate(prompt) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: prompt
    });

    return interaction.output_text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}