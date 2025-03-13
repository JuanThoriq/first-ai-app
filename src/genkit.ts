"use server";

// Melakukan import model
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";
import { genkit, z } from "genkit"; // z atau zod untuk validasi result dari ai

const ai = genkit({
  // plugins bisa copot pasang model
  // Jadi kalo mau mau pake OpenAI maka ganti aja menjadi OpenAI
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: gemini20Flash,
});

// Create Workflow
const resultSchema = z.object({
  judge: z.string(),
  solution: z.string(),
});

// Fungsi untuk mengenerate outputnya
export const generateFlow = ai.defineFlow(
  {
    name: "generateFlow", // Nama flow sama dengan nama fungsi
    inputSchema: z.string(),
  },
  async (url) => {
    const { output } = await ai.generate({
      system:
        "Kamu adalah kritikus yang cerdas dan sering memberikan kritik yang jujur dengan bahasa yang komprehensif, relevan, dan mudah dipahami serta to the poin",
      prompt: `Buatkan saya kritik untuk akun social media dengan link berikut ${url}`,
      output: {
        schema: resultSchema,
      },
    });
    return output;
  } // Hit API modelnya yaitu Gemini sehingga menggunakan async await
);

export const generateByImageURLFlow = ai.defineFlow(
  {
    name: "generateFlow",
    inputSchema: z.string(),
  },
  async (url) => {
    const { text } = await ai.generate([
      { media: { url } },
      { text: "buat puisi dari gambar tersebut" },
    ]);
    return text;
  }
);
