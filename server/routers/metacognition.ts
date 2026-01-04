import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { specialists } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";

export const metacognitionRouter = router({
  // Get all specialists
  getSpecialists: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userSpecialists = await db
      .select()
      .from(specialists)
      .where(eq(specialists.userId, ctx.user.id));

    return userSpecialists;
  }),

  // Analyze response with specialists
  analyzeResponse: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        response: z.string(),
        aiProvider: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Análise com os 3 especialistas em paralelo
        const [logicAnalysis, empathyAnalysis, factsAnalysis] =
          await Promise.all([
            // Especialista em Lógica
            invokeLLM({
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um especialista em Lógica. Analise a resposta quanto a: consistência lógica, validade dos argumentos, falácias e coerência. Seja conciso.",
                },
                {
                  role: "user",
                  content: `Pergunta: "${input.prompt}"\nResposta: "${input.response}"\n\nAnálise lógica:`,
                },
              ],
            }),
            // Especialista em Empatia
            invokeLLM({
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um especialista em Empatia e Comunicação. Analise a resposta quanto a: tom, sensibilidade, clareza e adequação contextual. Seja conciso.",
                },
                {
                  role: "user",
                  content: `Pergunta: "${input.prompt}"\nResposta: "${input.response}"\n\nAnálise de empatia:`,
                },
              ],
            }),
            // Especialista em Fatos
            invokeLLM({
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um especialista em Fatos e Verificação. Analise a resposta quanto a: precisão factual, fontes, especulações e completude. Seja conciso.",
                },
                {
                  role: "user",
                  content: `Pergunta: "${input.prompt}"\nResposta: "${input.response}"\n\nAnálise de fatos:`,
                },
              ],
            }),
          ]);

        // Sintetizar as análises em uma resposta final
        const synthesized = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um sintetizador de análises. Revise as análises dos 3 especialistas e crie uma resposta final aprimorada que incorpore os insights. Mantenha a essência original mas melhore a qualidade.",
            },
            {
              role: "user",
              content: `Pergunta: "${input.prompt}"\n\nResposta original: "${input.response}"\n\nAnálise Lógica:\n${logicAnalysis.choices[0]?.message?.content}\n\nAnálise Empatia:\n${empathyAnalysis.choices[0]?.message?.content}\n\nAnálise Fatos:\n${factsAnalysis.choices[0]?.message?.content}\n\nResposta final sintetizada:`,
            },
          ],
        });

        return {
          originalResponse: input.response,
          analyses: {
            logic: logicAnalysis.choices[0]?.message?.content,
            empathy: empathyAnalysis.choices[0]?.message?.content,
            facts: factsAnalysis.choices[0]?.message?.content,
          },
          synthesizedResponse: synthesized.choices[0]?.message?.content,
          aiProvider: input.aiProvider,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error analyzing response:", error);
        throw error;
      }
    }),

  // Compare multiple AI responses
  compareResponses: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        responses: z.array(
          z.object({
            aiProvider: z.string(),
            response: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comparison = await invokeLLM({
          messages: [
            {
              role: "system",
              content:
                "Você é um comparador de respostas de IA. Compare as respostas, identifique pontos fortes/fracos, diferenças importantes e recomende a melhor para o contexto.",
            },
            {
              role: "user",
              content: `Pergunta: "${input.prompt}"\n\nRespostas:\n${input.responses
                .map((r) => `${r.aiProvider}: "${r.response}"`)
                .join("\n\n")}\n\nComparação:`,
            },
          ],
        });

        return {
          prompt: input.prompt,
          responses: input.responses,
          comparison: comparison.choices[0]?.message?.content,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error comparing responses:", error);
        throw error;
      }
    }),
});
