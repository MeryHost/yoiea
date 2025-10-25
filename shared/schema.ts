import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  customLink: text("custom_link"),
  fileType: text("file_type").notNull(), // 'zip', 'html', 'css', 'js'
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertSiteSchema = createInsertSchema(sites).omit({
  uploadedAt: true,
});

export type InsertSite = z.infer<typeof insertSiteSchema>;
export type Site = typeof sites.$inferSelect;
