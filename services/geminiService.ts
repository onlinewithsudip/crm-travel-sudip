import { GoogleGenAI, Type } from "@google/genai";

export const generateItineraryWithAI = async (destination: string, duration: number, interests: string) => {
  // Always initialize GoogleGenAI exactly as per guidelines: const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a high-end travel itinerary for ${destination} for ${duration} days. User interests: ${interests}. Provide a JSON response.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  meals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  accommodation: { type: Type.STRING },
                },
                required: ["day", "title", "activities", "meals", "accommodation"]
              }
            },
            totalEstimatedCost: { type: Type.NUMBER }
          },
          required: ["title", "description", "days", "totalEstimatedCost"]
        }
      }
    });

    // Access the .text property directly from the response object as specified in the guidelines.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};