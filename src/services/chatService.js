import { userContext } from "../data/prompts";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Sends a message to the chatbot via the backend server
 * @param {string} userMessage - The message from the user
 * @returns {Promise<string>} - The chatbot's response
 */
export async function getChatbotResponse(userMessage) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: userContext },
          { role: "user", content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "An error occurred");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "An error occurred while getting a response. Please try again later.";
  }
}

/**
 * Checks if the backend server is available
 * @returns {Promise<boolean>} - Whether the server is available
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error("Server health check failed:", error);
    return false;
  }
} 