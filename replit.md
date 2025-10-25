# MeryHost - Static Site Hosting Platform

## Overview

MeryHost is a static site hosting platform that enables users to upload and deploy static websites instantly. Users can upload individual files (HTML, CSS, JS) or ZIP archives containing complete websites, receive a unique URL, and manage their hosted sites through a dashboard interface. The platform emphasizes simplicity and speed, inspired by modern developer platforms like Vercel and Linear.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack

**Frontend Framework**: React with TypeScript
- Client-side routing using Wouter
- State management via TanStack Query (React Query)
- Form handling with React Hook Form and Zod validation
- UI components from shadcn/ui (Radix UI primitives)

**Backend Framework**: Express.js with TypeScript
- RESTful API architecture
- File upload handling with Multer
- ZIP file extraction using Unzipper

**Database**: PostgreSQL via Neon serverless
- ORM: Drizzle ORM
- Schema management with drizzle-kit
- Connection pooling through Neon's serverless driver

**Build System**: Vite
- Development server with HMR
- Production bundling for client code
- esbuild for server-side bundling

### Design System

The application follows a carefully defined design system documented in `design_guidelines.md`:

**Typography**: Inter for UI text, JetBrains Mono for monospace content (URLs, filenames)

**Color System**: Custom HSL-based color variables supporting light/dark modes with semantic naming (primary, secondary, muted, accent, destructive)

**Spacing**: Tailwind-based spacing primitives using units of 2, 4, 6, 8, 12, 16, and 24

**Component Philosophy**: "Clarity over decoration" - every element serves a functional purpose, emphasizing speed and confidence in user interactions

### Database Schema

**Sites Table** (`shared/schema.ts`):
- `id` (text, primary key): Unique identifier for each site
- `filename` (text): Original uploaded filename
- `customLink` (text, optional): User-defined custom URL slug
- `fileType` (text): Type of uploaded file ('zip', 'html', 'css', 'js')
- `uploadedAt` (timestamp): Auto-generated upload timestamp

The schema supports both individual file uploads and ZIP archives containing multiple files.

### API Architecture

**Upload Endpoint** (`POST /api/upload`):
- Accepts multipart form data with file and optional customLink
- File size limit: 10MB
- Allowed extensions: .html, .css, .js, .zip
- Returns site metadata including generated URL

**Sites Management**:
- `GET /api/sites`: Retrieve all user sites
- `DELETE /api/sites/:id`: Remove a specific site

File uploads are processed to a temporary directory, ZIP files are extracted, and content is served from `public/sites/{site-id}/`.

### File Storage Strategy

**Upload Flow**:
1. Files uploaded to temporary directory via Multer
2. ZIP files extracted using Unzipper library
3. Sanitized ID generation (custom or random 4-byte hex)
4. Files moved to permanent storage at `public/sites/{id}/`
5. Database record created with metadata

**Security Measures**:
- File extension validation (whitelist approach)
- Custom link sanitization (alphanumeric and hyphens only)
- Size limits enforced at upload time

### Frontend Architecture

**Routing Structure**:
- `/` - Home page with upload interface
- `/account` - Dashboard showing all uploaded sites

**State Management**:
- Server state cached via React Query
- Optimistic updates for deletions
- Toast notifications for user feedback

**Key Components**:
- `UploadCard`: Main file upload interface with drag-and-drop
- `SiteCard`: Individual site display with copy URL and delete actions
- `SuccessModal`: Post-upload confirmation with shareable URL
- `Header`: Navigation with conditional rendering based on route

### Development Workflow

**Development Mode**: 
- Vite dev server with middleware mode
- Express API server
- Hot module replacement for client code

**Production Build**:
1. Vite builds client to `dist/public`
2. esbuild bundles server to `dist/index.js`
3. Static assets served from Express

**Database Migrations**: Managed via `drizzle-kit push` command

## External Dependencies

**Database Service**: Neon PostgreSQL
- Serverless PostgreSQL provider
- Connection via `@neondatabase/serverless` driver
- Requires `DATABASE_URL` environment variable

**UI Component Library**: shadcn/ui
- Built on Radix UI primitives
- Customizable via Tailwind CSS
- Components styled according to design system guidelines

**Icon Library**: Lucide React
- Consistent iconography throughout the application

**Font Services**: Google Fonts
- Inter: Primary UI font
- JetBrains Mono: Monospace font for technical content

**Development Tools** (Replit-specific):
- `@replit/vite-plugin-runtime-error-modal`: Error overlay
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development indicator

**Form Validation**: Zod
- Runtime type checking
- Integration with React Hook Form via `@hookform/resolvers`