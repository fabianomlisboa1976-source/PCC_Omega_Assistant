import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, conversations, messages, knowledgeBase, specialists, aiCredentials, taskLoops, userSettings, InsertUserSettings } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Conversation queries
export async function createConversation(userId: number, title: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(conversations).values({ userId, title, description });
}

export async function getConversationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(conversations).where(eq(conversations.userId, userId));
}

// Message queries
export async function createMessage(conversationId: number, userId: number, role: "user" | "assistant" | "system", content: string, aiModel?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(messages).values({ conversationId, userId, role, content, aiModel });
}

export async function getMessagesByConversationId(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(messages).where(eq(messages.conversationId, conversationId));
}

// Knowledge base queries
export async function addKnowledgeEntry(userId: number, topic: string, content: string, sourceType: string, sourceReference?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(knowledgeBase).values({ userId, topic, content, sourceType, sourceReference });
}

export async function getKnowledgeByTopic(userId: number, topic: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { and } = require("drizzle-orm");
  return db.select().from(knowledgeBase).where(and(eq(knowledgeBase.userId, userId), eq(knowledgeBase.topic, topic)));
}

// Specialists queries
export async function getSpecialistsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(specialists).where(eq(specialists.userId, userId));
}

// AI Credentials queries
export async function getAiCredentialsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(aiCredentials).where(eq(aiCredentials.userId, userId));
}

// Task loops queries
export async function getTaskLoopsByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(taskLoops).where(eq(taskLoops.userId, userId));
}

// User settings queries
export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserSettings(userId: number, settings: Partial<InsertUserSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(userSettings).set(settings).where(eq(userSettings.userId, userId));
}
