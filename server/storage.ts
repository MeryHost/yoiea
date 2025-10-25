import { type Site, type InsertSite, sites } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Site operations
  getSite(id: string): Promise<Site | undefined>;
  getSitesByUser(userId: string): Promise<Site[]>;
  createSite(site: InsertSite): Promise<Site>;
  deleteSite(id: string, userId: string): Promise<void>;
}

export class DbStorage implements IStorage {

  // Site operations
  async getSite(id: string): Promise<Site | undefined> {
    const [site] = await db.select().from(sites).where(eq(sites.id, id));
    return site;
  }

  async getSitesByUser(userId: string): Promise<Site[]> {
    return await db.select().from(sites).where(eq(sites.userId, userId));
  }

  async createSite(insertSite: InsertSite): Promise<Site> {
    const [site] = await db.insert(sites).values(insertSite).returning();
    return site;
  }

  async deleteSite(id: string, userId: string): Promise<void> {
    // Only delete if the site belongs to the user
    await db.delete(sites).where(and(eq(sites.id, id), eq(sites.userId, userId)));
  }
}

export const storage = new DbStorage();
