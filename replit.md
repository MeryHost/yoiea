# MeryHost - Personal Admin Panel

## Overview
MeryHost is a personal web hosting admin panel where you can upload zipped folders or single HTML/CSS/JS files and receive unique shareable URLs. The application features a modern yellow-accented design with simple username/password authentication.

## Project Status
✅ Fully functional hosting platform with:
- Simple admin authentication (username/password)
- File upload (HTML, CSS, JS, ZIP files)
- ZIP extraction and static file serving
- Custom link names for hosted sites
- Dashboard showing all hosted sites
- Delete functionality for managing sites
- Secure file handling with validation

## Admin Credentials
- **Username**: MeryHostapps
- **Password**: 1111Mery–host

## Architecture

### Frontend
- **Framework**: React with Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query v5)
- **UI Components**: Shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS with yellow accent color (45 100% 50%)
- **Typography**: Inter for UI, JetBrains Mono for monospace
- **Authentication**: Simple session-based authentication with login form

### Backend
- **Framework**: Express.js
- **Authentication**: Session-based with hardcoded admin credentials
- **Session Management**: PostgreSQL session store (connect-pg-simple)
- **Database**: PostgreSQL (Neon)
- **File Upload**: Multer (10MB limit)
- **ZIP Extraction**: Unzipper with Zip Slip protection
- **File Storage**: Local filesystem at `/public/sites/{id}/`

### Database Schema
```typescript
// Sessions table (for session storage)
sessions {
  sid: varchar (primary key) - Session ID
  sess: jsonb - Session data
  expire: timestamp - Expiration time
}

// Users table (simplified admin table)
users {
  id: varchar (primary key) - Generated UUID
  username: varchar (unique) - Admin username
  passwordHash: varchar - Hashed password (not currently used - plaintext comparison)
  createdAt: timestamp - Auto-generated
}

// Sites table with user association
sites {
  id: text (primary key) - Generated from customLink or random hex
  userId: varchar (foreign key to users.id) - Owner of the site
  filename: text - Original filename
  customLink: text | null - Optional custom URL segment
  fileType: text - File extension (html, css, js, zip)
  uploadedAt: timestamp - Auto-generated
}
```

## API Endpoints

### Authentication Endpoints
- **POST /api/login** - Login with username and password (returns JSON)
- **GET /api/logout** - Logs out user and redirects to home
- **GET /api/auth/user** - Returns current authenticated user (protected)

### Site Management Endpoints
All endpoints below require authentication (isAuthenticated middleware).

**POST /api/upload**
- Accepts: multipart/form-data with 'file' and optional 'customLink'
- Validates: File type (.html, .css, .js, .zip only)
- Returns: `{ success: true, site: {...}, url: string }`
- Security: Zip Slip protection, file type validation, schema validation
- Associates site with authenticated user

**GET /api/sites**
- Returns: Array of sites owned by authenticated user with URLs

**GET /api/sites/:id**
- Returns: Single site by ID (only if owned by authenticated user)
- Returns 403 if site belongs to another user

**DELETE /api/sites/:id**
- Deletes site files and database record
- Returns: `{ success: true }`
- Only allows deletion of sites owned by authenticated user

## URL Structure
- **ZIP files**: `/site/{id}/` (serves index.html from extracted content)
- **HTML files**: `/site/{id}/{filename}`
- **CSS/JS files**: `/site/{id}/{filename}`

## Security Features
1. **Simple Authentication**: Session-based admin login
2. **Session Management**: Secure session storage in PostgreSQL
3. **User Isolation**: Single admin user can access all sites
4. **File Type Validation**: Only allows .html, .css, .js, .zip files
5. **Zip Slip Protection**: Validates ZIP entry paths to prevent directory traversal
6. **Schema Validation**: Uses Zod schemas to validate all inputs
7. **File Size Limit**: 10MB maximum upload size
8. **Custom Link Sanitization**: Only alphanumeric characters and hyphens allowed
9. **Credential Management**: All API requests include credentials for session cookies

## User Flow (Admin Panel)
1. **Access**: Navigate to `/login` to authenticate
2. **Login**: Enter admin credentials
3. **Homepage** (`/`): Upload card for adding new sites
4. **Upload**: Upload file with optional custom link
5. **Success Modal**: Shows shareable URL
6. **Dashboard** (`/account`): Lists all hosted sites
7. **Manage**: View URLs and delete sites

## Pages
- **Login** (`/login`): Simple login form with username/password
- **Home** (`/`): Upload interface (requires authentication)
- **Account** (`/account`): Dashboard showing all hosted sites (requires authentication)

## Recent Changes (October 25, 2025)
### Initial Implementation
- Implemented full backend with PostgreSQL database
- Added secure file upload with Multer and Unzipper
- Implemented Zip Slip protection and file validation
- Connected frontend to backend API endpoints
- Added delete functionality with confirmation dialog
- Fixed URL construction for all file types
- End-to-end tested upload and delete flows

### Authentication Conversion (from Replit Auth to Simple Auth)
- Removed Replit Auth (OpenID Connect) integration
- Implemented simple session-based authentication
- Hardcoded admin credentials in backend (MeryHostapps / 1111Mery–host)
- Created custom login page with username/password form
- Simplified user table (removed OIDC fields)
- Updated all routes to use session-based userId
- Changed authentication redirects from `/api/login` to `/login`
- Fixed Home.tsx redirect to use `/login` instead of deprecated `/api/login`
- Created admin user record in database to satisfy foreign key constraints

### Design Changes
- Changed theme color from purple (265 100% 63%) to yellow (45 100% 50%)
- Updated primary color throughout the application
- Maintained clean, professional admin panel aesthetic

### ZIP Extraction Fix
- Fixed nested folder issue in ZIP uploads
- Added automatic flattening for single-folder ZIP structures
- When a ZIP contains only one top-level directory, contents are moved up one level
- This ensures index.html is at the correct path (/public/sites/{id}/index.html)
- Manually fixed existing snake-game upload to work correctly
- New uploads will automatically flatten nested structures

## Design Guidelines
- **Primary Color**: Yellow (45 100% 50%)
- **Design Style**: Clean admin panel focused on functionality
- **Header**: Logo on left, minimal controls on right (My Sites, Log out)
- **Upload Card**: Centered with custom link input, file type tabs, drag & drop
- **Dashboard**: Clean card-based layout with action buttons
- **Login**: Centered card with username/password inputs

## Technical Notes
- **Query Key Convention**: First element of query key array must be the full URL string
- **Credentials**: All API requests include `credentials: 'include'` for session cookies
- **Authentication**: Simple session-based auth with hardcoded credentials
- **Admin Panel**: Single admin user manages all hosted sites

## Known Limitations
- Currently using in-development database (not production)
- Password stored as plaintext in code (acceptable for single-user admin panel)
- No password hashing implemented (not needed for this use case)

## Future Enhancements
- Custom domain support with domain verification
- File analytics and usage statistics
- Automated cleanup of expired sessions
- Better error messages (400 vs 500 responses)
- Additional file type support (with security review)
- Optional password hashing for improved security
