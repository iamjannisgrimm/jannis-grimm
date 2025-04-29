import { userContext } from "../data/prompts"; // Ensure correct import path

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY; 
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function getChatbotResponse(userMessage) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: userContext }, // First system prompt with user context
          { role: "user", content: userMessage } // User message
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "An error occurred while getting a response.";
  }
}
