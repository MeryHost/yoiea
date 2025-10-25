# MeryHost - Personal Admin Panel

## Overview
MeryHost is a personal web hosting admin panel where you can upload zipped folders or single HTML/CSS/JS files and receive unique shareable URLs. The application features a modern purple-accented design and requires authentication to access.

## Project Status
✅ Fully functional hosting platform with:
- User authentication with Replit Auth (admin access only)
- File upload (HTML, CSS, JS, ZIP files)
- ZIP extraction and static file serving
- Custom link names for hosted sites
- Dashboard showing all your hosted sites
- Delete functionality for managing sites
- Secure file handling with validation

## Architecture

### Frontend
- **Framework**: React with Vite
- **Routing**: Wouter
- **State Management**: TanStack Query (React Query v5)
- **UI Components**: Shadcn/ui with Radix primitives
- **Styling**: Tailwind CSS with purple accent color (265 100% 63%)
- **Typography**: Inter for UI, JetBrains Mono for monospace
- **Authentication**: useAuth hook with Replit Auth

### Backend
- **Framework**: Express.js
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js
- **Session Management**: PostgreSQL session store (connect-pg-simple)
- **Database**: PostgreSQL (Neon)
- **File Upload**: Multer (10MB limit)
- **ZIP Extraction**: Unzipper with Zip Slip protection
- **File Storage**: Local filesystem at `/public/sites/{id}/`

### Database Schema
```typescript
// Sessions table (required for Replit Auth)
sessions {
  sid: varchar (primary key) - Session ID
  sess: jsonb - Session data
  expire: timestamp - Expiration time
}

// Users table (required for Replit Auth)
users {
  id: varchar (primary key) - Generated UUID or Replit user ID
  email: varchar (unique) - User email
  firstName: varchar - First name
  lastName: varchar - Last name
  profileImageUrl: varchar - Profile image URL
  createdAt: timestamp - Auto-generated
  updatedAt: timestamp - Auto-generated
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
- **GET /api/login** - Initiates Replit Auth login flow (access directly via URL)
- **GET /api/callback** - OAuth callback handler
- **GET /api/logout** - Logs out user and redirects
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
1. **User Authentication**: Replit Auth with OpenID Connect
2. **Session Management**: Secure session storage in PostgreSQL
3. **User Isolation**: Users can only access their own sites
4. **File Type Validation**: Only allows .html, .css, .js, .zip files
5. **Zip Slip Protection**: Validates ZIP entry paths to prevent directory traversal
6. **Schema Validation**: Uses Zod schemas to validate all inputs
7. **File Size Limit**: 10MB maximum upload size
8. **Custom Link Sanitization**: Only alphanumeric characters and hyphens allowed
9. **Credential Management**: All API requests include credentials for session cookies

## User Flow (Admin Panel)
1. **Access**: Navigate to `/api/login` to authenticate
2. **Homepage** (`/`): Upload card for adding new sites
3. **Upload**: Upload file with optional custom link
4. **Success Modal**: Shows shareable URL
5. **Dashboard** (`/account`): Lists all hosted sites
6. **Manage**: View URLs and delete sites

## Pages
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

### Authentication Implementation
- Integrated Replit Auth for user authentication
- Added users and sessions tables to database
- Updated sites table with userId foreign key for ownership
- Protected all API routes with isAuthenticated middleware
- Implemented user-specific site filtering (users only see their own sites)
- Added useAuth hook for authentication state management
- Protected all pages to require authentication
- Fixed queryClient to properly handle auth state with credentials

### Admin Panel Conversion
- Removed public login/signup buttons from header
- Simplified header to show only "My Sites" and "Log out" when authenticated
- Access login by navigating directly to `/api/login`
- All features require authentication (admin-only access)

## Design Guidelines
- **Primary Color**: Purple (265 100% 63%)
- **Header**: Logo on left, minimal controls on right (My Sites, Log out)
- **Upload Card**: Centered with custom link input, file type tabs, drag & drop
- **Dashboard**: Clean card-based layout with action buttons

## Technical Notes
- **Query Key Convention**: First element of query key array must be the full URL string
- **Credentials**: All API requests include `credentials: 'include'` for session cookies
- **Authentication Access**: Navigate to `/api/login` to authenticate
- **Admin Panel**: No public signup - authentication required for all features

## Known Limitations
- Currently using in-development database (not production)
- Access requires manual navigation to `/api/login`

## Future Enhancements
- Custom domain support with domain verification
- File analytics and usage statistics
- Automated cleanup of expired sessions
- Better error messages (400 vs 500 responses)
- Additional file type support (with security review)
