import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Conversations table - stores chat history
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages table - stores individual messages in conversations
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  aiModel: varchar("aiModel", { length: 64 }), // Which AI model generated this response
  metadata: json("metadata"), // Additional metadata like tokens used, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Knowledge base table - stores assimilated knowledge
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  subtopic: varchar("subtopic", { length: 255 }),
  content: text("content").notNull(),
  sourceType: varchar("sourceType", { length: 64 }).notNull(), // "user_input", "ai_response", "document", etc.
  sourceReference: varchar("sourceReference", { length: 255 }), // Reference to original source
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0.00 to 1.00
  assimilatedAt: timestamp("assimilatedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeEntry = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeEntry = typeof knowledgeBase.$inferInsert;

// Metacognition configuration table
export const metacognitionConfig = mysqlTable("metacognition_config", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  key: varchar("key", { length: 128 }).notNull(),
  value: text("value").notNull(),
  description: text("description"),
  editable: boolean("editable").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MetacognitionConfig = typeof metacognitionConfig.$inferSelect;
export type InsertMetacognitionConfig = typeof metacognitionConfig.$inferInsert;

// Specialists ("Perninhas") table
export const specialists = mysqlTable("specialists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  specialty: varchar("specialty", { length: 255 }).notNull(),
  systemPrompt: text("systemPrompt").notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Specialist = typeof specialists.$inferSelect;
export type InsertSpecialist = typeof specialists.$inferInsert;

// AI Credentials table - stores API keys and configuration for each AI
export const aiCredentials = mysqlTable("ai_credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  aiProvider: varchar("aiProvider", { length: 64 }).notNull(), // "openai", "gemini", "deepseek", etc.
  apiKey: text("apiKey").notNull(),
  apiUrl: varchar("apiUrl", { length: 512 }),
  customParams: json("customParams"), // Additional parameters for the API
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AiCredential = typeof aiCredentials.$inferSelect;
export type InsertAiCredential = typeof aiCredentials.$inferInsert;

// Task loops table - stores configuration for continuous task execution
export const taskLoops = mysqlTable("task_loops", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  taskDefinition: text("taskDefinition").notNull(),
  intervalSeconds: int("intervalSeconds").notNull(), // How often to run the task
  isRunning: boolean("isRunning").default(false).notNull(),
  lastExecutedAt: timestamp("lastExecutedAt"),
  nextExecutionAt: timestamp("nextExecutionAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaskLoop = typeof taskLoops.$inferSelect;
export type InsertTaskLoop = typeof taskLoops.$inferInsert;

// Calendar events table
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  location: varchar("location", { length: 255 }),
  category: varchar("category", { length: 64 }), // "personal", "work", "health", etc.
  reminder: int("reminder"), // Minutes before event
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

// Tasks table
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  dueDate: timestamp("dueDate"),
  category: varchar("category", { length: 64 }), // "personal", "work", "health", etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// Contacts table
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  notes: text("notes"),
  category: varchar("category", { length: 64 }), // "personal", "professional", "family", etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// CRM records table
export const crmRecords = mysqlTable("crm_records", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contactId: int("contactId"),
  recordType: varchar("recordType", { length: 64 }).notNull(), // "lead", "opportunity", "deal", "follow_up", etc.
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 64 }).notNull(), // "new", "in_progress", "closed", etc.
  value: decimal("value", { precision: 12, scale: 2 }), // Monetary value
  dueDate: timestamp("dueDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CrmRecord = typeof crmRecords.$inferSelect;
export type InsertCrmRecord = typeof crmRecords.$inferInsert;

// Goals table
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 64 }).notNull(), // "personal", "professional", "health", "financial", etc.
  targetDate: timestamp("targetDate"),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "abandoned"]).default("not_started").notNull(),
  progress: int("progress").default(0), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

// User settings table
export const userSettings = mysqlTable("user_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  fontSize: int("fontSize").default(14).notNull(), // Base font size in pixels
  theme: varchar("theme", { length: 32 }).default("dark").notNull(),
  language: varchar("language", { length: 10 }).default("pt-BR").notNull(),
  notificationsEnabled: boolean("notificationsEnabled").default(true).notNull(),
  soundEnabled: boolean("soundEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;