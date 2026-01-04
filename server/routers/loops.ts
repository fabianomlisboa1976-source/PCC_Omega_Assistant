import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { taskLoops } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const loopsRouter = router({
  // Get all task loops
  getTaskLoops: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const loops = await db
      .select()
      .from(taskLoops)
      .where(eq(taskLoops.userId, ctx.user.id));

    return loops;
  }),

  // Create a new task loop
  createTaskLoop: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        taskDefinition: z.string(),
        intervalSeconds: z.number().min(60),
        isRunning: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(taskLoops).values({
        userId: ctx.user.id,
        name: input.name,
        taskDefinition: input.taskDefinition,
        intervalSeconds: input.intervalSeconds,
        isRunning: input.isRunning,
        lastExecutedAt: new Date(),
        nextExecutionAt: new Date(Date.now() + input.intervalSeconds * 1000),
      });

      return { success: true };
    }),

  // Update task loop
  updateTaskLoop: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        taskDefinition: z.string().optional(),
        intervalSeconds: z.number().min(60).optional(),
        isRunning: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.taskDefinition) updateData.taskDefinition = input.taskDefinition;
      if (input.intervalSeconds) updateData.intervalSeconds = input.intervalSeconds;
      if (input.isRunning !== undefined) updateData.isRunning = input.isRunning;

      await db
        .update(taskLoops)
        .set(updateData)
        .where(eq(taskLoops.id, input.id));

      return { success: true };
    }),

  // Delete task loop
  deleteTaskLoop: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(taskLoops).where(eq(taskLoops.id, input.id));

      return { success: true };
    }),

  // Execute task loop manually
  executeTaskLoop: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const loop = await db
        .select()
        .from(taskLoops)
        .where(eq(taskLoops.id, input.id))
        .limit(1);

      if (!loop.length) {
        throw new Error("Task loop not found");
      }

      const taskLoop = loop[0];

      // Update last executed time and next execution time
      const nextExecution = new Date(
        Date.now() + (taskLoop?.intervalSeconds || 60) * 1000
      );

      await db
        .update(taskLoops)
        .set({
          lastExecutedAt: new Date(),
          nextExecutionAt: nextExecution,
        })
        .where(eq(taskLoops.id, input.id));

      return {
        success: true,
        taskLoop,
        executedAt: new Date(),
        nextExecution,
        message: `Task loop "${taskLoop.name}" executed successfully`,
      };
    }),

  // Get task loop execution history
  getExecutionHistory: protectedProcedure
    .input(z.object({ taskLoopId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const loop = await db
        .select()
        .from(taskLoops)
        .where(eq(taskLoops.id, input.taskLoopId))
        .limit(1);

      if (!loop.length) {
        return null;
      }

      const taskLoop = loop[0];
      const nextExecution = taskLoop?.nextExecutionAt
        ? new Date(taskLoop.nextExecutionAt)
        : new Date(Date.now() + (taskLoop?.intervalSeconds || 60) * 1000);

      return {
        taskLoop,
        lastExecuted: taskLoop?.lastExecutedAt,
        nextExecution,
        isOverdue:
          nextExecution < new Date() && taskLoop?.isRunning,
      };
    }),
});
