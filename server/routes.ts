import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import multer from "multer";
import { randomBytes } from "crypto";
import * as fs from "fs";
import * as path from "path";
import unzipper from "unzipper";
import { insertSiteSchema } from "@shared/schema";
import express from "express";

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), "public", "sites");
const TEMP_DIR = path.join(process.cwd(), "temp");

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.html', '.css', '.js', '.zip'];

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Configure multer for file uploads (10MB limit)
const upload = multer({
  dest: TEMP_DIR,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`));
    }
  },
});

// Helper function to generate unique ID
function generateId(customLink?: string): string {
  if (customLink) {
    // Sanitize custom link - only alphanumeric and hyphens
    return customLink.toLowerCase().replace(/[^a-z0-9-]/g, '');
  }
  return randomBytes(4).toString('hex');
}

// Helper function to safely validate ZIP entry path
function isValidZipEntryPath(entryPath: string): boolean {
  // Normalize the path and check for directory traversal
  const normalized = path.normalize(entryPath);
  
  // Reject absolute paths
  if (path.isAbsolute(normalized)) {
    return false;
  }
  
  // Reject paths with directory traversal
  if (normalized.includes('..')) {
    return false;
  }
  
  return true;
}

// Helper function to flatten single-folder ZIP structures
async function flattenZipIfNeeded(extractPath: string): Promise<void> {
  const entries = fs.readdirSync(extractPath);
  
  // Filter out hidden/system files (macOS metadata, .DS_Store, etc.)
  const visibleEntries = entries.filter(entry => {
    // Ignore hidden files (starting with .)
    if (entry.startsWith('.')) return false;
    // Ignore macOS metadata folder
    if (entry === '__MACOSX') return false;
    return true;
  });
  
  // Check if there's only one visible top-level entry and it's a directory
  if (visibleEntries.length === 1) {
    const singleEntry = visibleEntries[0];
    const singleEntryPath = path.join(extractPath, singleEntry);
    const stats = fs.statSync(singleEntryPath);
    
    if (stats.isDirectory()) {
      // Move all contents from the nested folder to the parent
      const nestedContents = fs.readdirSync(singleEntryPath);
      
      for (const item of nestedContents) {
        const srcPath = path.join(singleEntryPath, item);
        const destPath = path.join(extractPath, item);
        fs.renameSync(srcPath, destPath);
      }
      
      // Remove the now-empty nested folder
      fs.rmdirSync(singleEntryPath);
      
      // Clean up any remaining hidden/system files
      for (const entry of entries) {
        if (!visibleEntries.includes(entry)) {
          const hiddenPath = path.join(extractPath, entry);
          if (fs.existsSync(hiddenPath)) {
            if (fs.statSync(hiddenPath).isDirectory()) {
              fs.rmSync(hiddenPath, { recursive: true, force: true });
            } else {
              fs.unlinkSync(hiddenPath);
            }
          }
        }
      }
    }
  }
}

// Helper function to extract zip file safely
async function extractZipSafely(zipPath: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const directory = unzipper.Parse();
    
    fs.createReadStream(zipPath)
      .pipe(directory)
      .on('entry', (entry) => {
        const fileName = entry.path;
        
        // Validate the entry path
        if (!isValidZipEntryPath(fileName)) {
          entry.autodrain();
          reject(new Error(`Invalid path in ZIP: ${fileName}`));
          return;
        }
        
        // Construct safe destination path
        const targetPath = path.join(destPath, fileName);
        
        // Double-check the resolved path is within destPath
        if (!targetPath.startsWith(destPath)) {
          entry.autodrain();
          reject(new Error(`Path traversal attempt detected: ${fileName}`));
          return;
        }
        
        if (entry.type === 'Directory') {
          fs.mkdirSync(targetPath, { recursive: true });
          entry.autodrain();
        } else {
          // Ensure parent directory exists
          fs.mkdirSync(path.dirname(targetPath), { recursive: true });
          entry.pipe(fs.createWriteStream(targetPath));
        }
      })
      .on('close', async () => {
        try {
          // Flatten if the ZIP contains a single top-level folder
          await flattenZipIfNeeded(destPath);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Helper function to copy single file
function copySingleFile(sourcePath: string, destPath: string, filename: string): void {
  const destFile = path.join(destPath, filename);
  fs.copyFileSync(sourcePath, destFile);
}

// Helper function to delete directory recursively
function deleteDirectory(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  await setupAuth(app);

  // Serve static files for hosted sites
  app.use('/site', express.static(UPLOAD_DIR));

  // Upload file endpoint (protected)
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.session.userId;
      const customLink = req.body.customLink || '';
      const filename = req.file.originalname;
      const fileType = path.extname(filename).slice(1).toLowerCase();
      
      // Validate file extension
      if (!ALLOWED_EXTENSIONS.includes(`.${fileType}`)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}` });
      }
      
      const id = generateId(customLink);
      
      // Validate with schema
      const siteData = insertSiteSchema.parse({
        id,
        userId,
        filename,
        customLink: customLink || null,
        fileType,
      });
      
      // Create site directory
      const siteDir = path.join(UPLOAD_DIR, id);
      if (fs.existsSync(siteDir)) {
        fs.unlinkSync(req.file.path);
        return res.status(409).json({ error: 'Site with this custom link already exists' });
      }
      fs.mkdirSync(siteDir, { recursive: true });

      // Handle zip files
      if (fileType === 'zip') {
        try {
          await extractZipSafely(req.file.path, siteDir);
          fs.unlinkSync(req.file.path);
        } catch (error) {
          // Clean up on extraction error
          deleteDirectory(siteDir);
          fs.unlinkSync(req.file.path);
          throw error;
        }
      } else {
        // For single files (html, css, js)
        copySingleFile(req.file.path, siteDir, filename);
        fs.unlinkSync(req.file.path);
      }

      // Save to database
      const site = await storage.createSite(siteData);

      // Generate the correct URL based on file type
      let url = `/site/${id}`;
      if (fileType !== 'zip' && fileType !== 'html') {
        // For CSS/JS files, include the filename
        url = `/site/${id}/${filename}`;
      } else if (fileType === 'html') {
        // For HTML files, use the filename
        url = `/site/${id}/${filename}`;
      }

      res.json({
        success: true,
        site: {
          ...site,
          url, // Include the URL in the response
        },
        url,
      });
    } catch (error) {
      console.error('Upload error:', error);
      // Clean up on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      res.status(500).json({ error: message });
    }
  });

  // Get all sites for current user (protected)
  app.get('/api/sites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const userSites = await storage.getSitesByUser(userId);
      
      // Add URL to each site
      const sitesWithUrls = userSites.map(site => {
        let url = `/site/${site.id}`;
        if (site.fileType !== 'zip' && site.fileType !== 'html') {
          url = `/site/${site.id}/${site.filename}`;
        } else if (site.fileType === 'html') {
          url = `/site/${site.id}/${site.filename}`;
        }
        return { ...site, url };
      });
      
      res.json(sitesWithUrls);
    } catch (error) {
      console.error('Error fetching sites:', error);
      res.status(500).json({ error: 'Failed to fetch sites' });
    }
  });

  // Get single site (protected)
  app.get('/api/sites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const site = await storage.getSite(req.params.id);
      
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      // Check if site belongs to user
      if (site.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // Add URL to the site
      let url = `/site/${site.id}`;
      if (site.fileType !== 'zip' && site.fileType !== 'html') {
        url = `/site/${site.id}/${site.filename}`;
      } else if (site.fileType === 'html') {
        url = `/site/${site.id}/${site.filename}`;
      }
      
      res.json({ ...site, url });
    } catch (error) {
      console.error('Error fetching site:', error);
      res.status(500).json({ error: 'Failed to fetch site' });
    }
  });

  // Delete site (protected)
  app.delete('/api/sites/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const site = await storage.getSite(req.params.id);
      
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      // Check if site belongs to user
      if (site.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Delete files
      const siteDir = path.join(UPLOAD_DIR, req.params.id);
      deleteDirectory(siteDir);

      // Delete from database
      await storage.deleteSite(req.params.id, userId);

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting site:', error);
      res.status(500).json({ error: 'Failed to delete site' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
