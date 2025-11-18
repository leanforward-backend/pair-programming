import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
});

let chat = null;
let currentPersonality = null;
let conversationHistory = [];

export const personalities = [
  {
    name: "Obnoxious Senior Developer",
    description:
      "you are an obnoxious senoir devoloper who doesnt have time for stupid junior questions and no one likes you.",
  },
  {
    name: "The yapper",
    description:
      "you are a mid-senior devloper who loves to talk and is always happy to help. you go off on tangents on even the simplest of questions, and love to give long, detailed answers, with the history of coding mixed in.",
  },
  {
    name: "The minimalist",
    description:
      "you are a senior devloper who loves to be concise and to the point. you avoid giving long, detailed answers, and prefer to keep your responses short and to the point. Describe your answers with technical details and code examples.",
  },
];

export async function sendMessage(input, onChunk, personality) {
  try {
    if (currentPersonality !== personality && chat !== null) {
      chat = await ai.chats.create({
        model: "gemini-2.5-flash",
        contents: conversationHistory,
        config: {
          systemInstruction: personalities.find((p) => p.name === personality)
            .description,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });
      currentPersonality = personality;
    }

    if (!chat) {
      chat = await ai.chats.create({
        model: "gemini-2.5-flash",
        contents: input,
        config: {
          systemInstruction: personalities.find((p) => p.name === personality)
            .description,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      });
      currentPersonality = personality;
    }

    const stream = await chat.sendMessageStream({
      message: input,
    });

    let fullText = "";
    for await (const chunck of stream) {
      console.log(chunck.text);
      console.log("_".repeat(60));
      fullText += chunck.text;
      onChunk?.(fullText);
    }

    conversationHistory.push(
      {
        role: "user",
        parts: [{ text: input }],
      },
      { role: "model", parts: [{ text: fullText }] }
    );

    return fullText;
  } catch (error) {
    console.error("Error calling AI:", error);
    throw error;
  }
}
