import { type Site, type InsertSite } from "@shared/schema";
import { db } from "./db";
import { sites } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Site operations
  getSite(id: string): Promise<Site | undefined>;
  getAllSites(): Promise<Site[]>;
  createSite(site: InsertSite): Promise<Site>;
  deleteSite(id: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getSite(id: string): Promise<Site | undefined> {
    const result = await db.select().from(sites).where(eq(sites.id, id));
    return result[0];
  }

  async getAllSites(): Promise<Site[]> {
    return await db.select().from(sites);
  }

  async createSite(insertSite: InsertSite): Promise<Site> {
    const result = await db.insert(sites).values(insertSite).returning();
    return result[0];
  }

  async deleteSite(id: string): Promise<void> {
    await db.delete(sites).where(eq(sites.id, id));
  }
}

export const storage = new DbStorage();
