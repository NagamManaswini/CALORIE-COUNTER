
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchFoodCalories = async (foodQuery: string) => {
  if (!process.env.API_KEY) {
    console.warn("API Key missing, returning default mock estimation.");
    return { name: foodQuery, calories: 100 };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Estimate calories for: ${foodQuery}. Return a JSON object with 'name' and 'calories' (number).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER }
          },
          required: ["name", "calories"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return data;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { name: foodQuery, calories: 150 }; // Fallback
  }
};
