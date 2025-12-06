import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createConversation,
  getConversationsByUserId,
  createMessage,
  getMessagesByConversationId,
  addKnowledgeEntry,
  getKnowledgeByTopic,
} from "../db";

export const chatRouter = router({
  // Create a new conversation
  createConversation: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await createConversation(ctx.user.id, input.title, input.description);
        return { success: true };
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
    }),

  // Get all conversations for the user
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getConversationsByUserId(ctx.user.id);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
  }),

  // Send a message and get AI response
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        content: z.string(),
        aiModels: z.array(z.string()).default(["openai"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Save user message
        await createMessage(
          input.conversationId,
          ctx.user.id,
          "user",
          input.content
        );

        // TODO: Orchestrate AI responses
        // 1. Call multiple AI models in parallel
        // 2. Apply metacognition analysis
        // 3. Synthesize response
        // 4. Save assistant message

        const assistantResponse = "Response from AI orchestration system";

        await createMessage(
          input.conversationId,
          ctx.user.id,
          "assistant",
          assistantResponse,
          "orchestrated"
        );

        return {
          success: true,
          response: assistantResponse,
        };
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    }),

  // Get messages for a conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await getMessagesByConversationId(input.conversationId);
      } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
      }
    }),

  // Add knowledge entry
  addKnowledge: protectedProcedure
    .input(
      z.object({
        topic: z.string(),
        content: z.string(),
        sourceType: z.string(),
        sourceReference: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await addKnowledgeEntry(
          ctx.user.id,
          input.topic,
          input.content,
          input.sourceType,
          input.sourceReference
        );
        return { success: true };
      } catch (error) {
        console.error("Error adding knowledge:", error);
        throw error;
      }
    }),

  // Get knowledge by topic
  getKnowledge: protectedProcedure
    .input(z.object({ topic: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await getKnowledgeByTopic(ctx.user.id, input.topic);
      } catch (error) {
        console.error("Error fetching knowledge:", error);
        return [];
      }
    }),
});
