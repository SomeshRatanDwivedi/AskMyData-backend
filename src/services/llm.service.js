import Groq from "groq-sdk";


const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables.");
}

const groq = new Groq({ apiKey: GROQ_API_KEY });
class LLM {
  constructor(modelName = "llama-3.3-70b-versatile") {
    this.model = modelName
  }

  /**
   * Generate answer from system + user prompt
   */
  async generate(systemPrompt, userPrompt, options = {}) {
    try {
      const { safetySettings, generationConfig } = options;

      const response = await groq.chat.completions.create({
        messages: [
          // Set an optional system message. This sets the behavior of the
          // assistant and can be used to provide specific instructions for
          // how it should behave throughout the conversation.
          {
            role: "system",
            content: systemPrompt,
          },
          // Set a user message for the assistant to respond to.
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: this.model,
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error("❌ LLM Generation Error:", err);
      throw err;
    }
  }

  /**
   * RAG Helper:
   * Create prompt using vector DB context + question
   */
  async answerWithContext(question, context) {
    const systemPrompt = `
      You are an AI assistant that answers strictly based on the provided context.
      - If the answer exists in context, return it clearly.
      - If not in the context, reply: "Not found in document."
      - Do NOT guess or hallucinate.
      - Keep answer short and to the point.
      - Add a short explanation.
    `;

    const userPrompt = `
        Context:
        ${context}

        Question: ${question}

        Answer:
        `;

    return await this.generate(systemPrompt, userPrompt, {
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.2
      }
    });
  }
}

export default LLM;
