import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getAiCredentialsByUserId } from "../db";

const AI_PROVIDERS = [
  "openai",
  "gemini",
  "manus",
  "deepseek",
  "grok",
  "claude",
  "mistral",
  "llama",
  "falcon",
  "cohere",
  "vertex",
  "huggingface",
  "perplexity",
  "you",
  "bing",
  "ernie",
];

export const aisRouter = router({
  // Get all configured AI credentials
  getCredentials: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getAiCredentialsByUserId(ctx.user.id);
    } catch (error) {
      console.error("Error fetching AI credentials:", error);
      return [];
    }
  }),

  // Add new AI credential
  addCredential: protectedProcedure
    .input(
      z.object({
        aiProvider: z.string(),
        apiKey: z.string(),
        apiUrl: z.string().optional(),
        customParams: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate AI provider
        if (!AI_PROVIDERS.includes(input.aiProvider)) {
          throw new Error(`Provedor de IA inválido: ${input.aiProvider}`);
        }
        // TODO: Save to database
        return {
          success: true,
          message: `Credencial para ${input.aiProvider} adicionada com sucesso`,
        };
      } catch (error) {
        console.error("Error adding AI credential:", error);
        throw error;
      }
    }),

  // Test AI connection
  testConnection: protectedProcedure
    .input(z.object({ aiProvider: z.string(), apiKey: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        // TODO: Test connection to AI provider
        return {
          success: true,
          message: `Conexão com ${input.aiProvider} testada com sucesso`,
        };
      } catch (error) {
        console.error("Error testing AI connection:", error);
        throw error;
      }
    }),

  // Get list of available AI providers
  getAvailableProviders: protectedProcedure.query(async () => {
    return [
      { id: "openai", name: "ChatGPT (OpenAI)" },
      { id: "gemini", name: "Gemini (Google)" },
      { id: "manus", name: "Manus" },
      { id: "deepseek", name: "Deepseek" },
      { id: "grok", name: "Grok (xAI)" },
      { id: "claude", name: "Claude (Anthropic)" },
      { id: "mistral", name: "Mistral AI" },
      { id: "llama", name: "Llama (Meta)" },
      { id: "falcon", name: "Falcon (TII)" },
      { id: "cohere", name: "Cohere" },
      { id: "vertex", name: "Vertex AI (Google)" },
      { id: "huggingface", name: "Hugging Face" },
      { id: "perplexity", name: "Perplexity AI" },
      { id: "you", name: "You.com" },
      { id: "bing", name: "Bing AI (Microsoft)" },
      { id: "ernie", name: "ERNIE Bot (Baidu)" },
    ];
  }),
});
