# MeryHost - Web Hosting Platform

## Overview
MeryHost is a full-stack web hosting platform similar to TiinyHost where users can upload zipped folders or single HTML/CSS/JS files and receive unique shareable URLs. The application features a modern purple-accented design matching tiiny.host's aesthetic.

## Project Status
✅ Fully functional hosting platform with:
- File upload (HTML, CSS, JS, ZIP files)
- ZIP extraction and static file serving
- Custom link names for hosted sites
- Dashboard for managing hosted sites
- Delete functionality
- Secure file handling with validation

## Architecture

### Frontend
- **Framework**: React with Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query v5)
- **UI Components**: Shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS with purple accent color (265 100% 63%)
- **Typography**: Inter for UI, JetBrains Mono for monospace

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **File Upload**: Multer (10MB limit)
- **ZIP Extraction**: Unzipper
- **File Storage**: Local filesystem at `/public/sites/{id}/`

### Database Schema
```typescript
sites {
  id: text (primary key) - Generated from customLink or random hex
  filename: text - Original filename
  customLink: text | null - Optional custom URL segment
  fileType: text - File extension (html, css, js, zip)
  uploadedAt: timestamp - Auto-generated
}
```

## API Endpoints

### POST /api/upload
- Accepts: multipart/form-data with 'file' and optional 'customLink'
- Validates: File type (.html, .css, .js, .zip only)
- Returns: `{ success: true, site: {...}, url: string }`
- Security: Zip Slip protection, file type validation, schema validation

### GET /api/sites
- Returns: Array of all hosted sites with URLs

### GET /api/sites/:id
- Returns: Single site by ID with URL

### DELETE /api/sites/:id
- Deletes site files and database record
- Returns: `{ success: true }`

## URL Structure
- **ZIP files**: `/site/{id}/` (serves index.html from extracted content)
- **HTML files**: `/site/{id}/{filename}`
- **CSS/JS files**: `/site/{id}/{filename}`

## Security Features
1. **File Type Validation**: Only allows .html, .css, .js, .zip files
2. **Zip Slip Protection**: Validates ZIP entry paths to prevent directory traversal
3. **Schema Validation**: Uses Zod schemas to validate all inputs
4. **File Size Limit**: 10MB maximum upload size
5. **Custom Link Sanitization**: Only alphanumeric characters and hyphens allowed

## User Flow
1. **Homepage** (`/`): Upload files with optional custom link name
2. **Upload**: File is validated, processed (extracted if ZIP), and stored
3. **Success Modal**: Shows shareable URL
4. **Dashboard** (`/account`): Lists all hosted sites
5. **Manage**: Users can view URLs and delete sites

## Pages
- **Home** (`/`): Landing page with upload card
- **Account** (`/account`): Dashboard showing Live Projects and Custom Domains sections

## Recent Changes (October 25, 2025)
- Implemented full backend with PostgreSQL database
- Added secure file upload with Multer and Unzipper
- Implemented Zip Slip protection and file validation
- Connected frontend to backend API endpoints
- Added delete functionality with confirmation dialog
- Fixed URL construction for all file types
- End-to-end tested upload and delete flows

## Design Guidelines
- **Primary Color**: Purple (265 100% 63%)
- **Design Inspiration**: tiiny.host
- **Header**: Logo on left, action buttons on right
  - Homepage: "Log in" and "Sign up free"
  - Account: "Earn $50", "Add Team", "Free plan", "Upgrade"
- **Upload Card**: Centered with custom link input, file type tabs, drag & drop
- **Dashboard**: Clean card-based layout with action buttons

## Known Limitations
- Currently using in-development database (not production)
- No authentication system yet
- No custom domain functionality implemented
- Free plan limit: 1 live site

## Future Enhancements
- User authentication and accounts
- Custom domain support
- Automated tests for security vulnerabilities
- Better error messages (400 vs 500 responses)
- Additional path resolution hardening for cross-platform compatibility
