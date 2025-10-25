# MeryHost Admin Panel Design Guidelines

## Design Approach

**Selected Approach:** Admin Panel - Clean, functional design focused on efficiency and ease of use for personal hosting management. Yellow accent color provides energy and visibility while maintaining professional appearance.

**Core Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Speed and confidence: Users should feel empowered to upload and manage with zero friction
- Professional simplicity: Clean, technical aesthetic that builds trust

---

## Typography System

**Font Families:**
- Primary: Inter (Google Fonts) - All UI text, headings, body
- Monospace: JetBrains Mono - URLs, file names, IDs

**Type Scale:**
- Hero/Page Title: text-4xl md:text-5xl font-bold tracking-tight
- Section Headers: text-2xl md:text-3xl font-semibold
- Subsection: text-xl font-semibold
- Body Large: text-lg font-medium
- Body Default: text-base
- Body Small: text-sm
- Captions/Meta: text-xs font-medium uppercase tracking-wide
- Monospace URLs: font-mono text-sm

---

## Layout System

**Spacing Primitives:** We will use Tailwind units of 2, 4, 6, 8, 12, 16, and 24 (p-2, m-4, gap-6, space-y-8, etc.)

**Container Strategy:**
- Page container: max-w-7xl mx-auto px-6 md:px-8
- Content sections: max-w-4xl for focused areas
- Dashboard cards: Full width within container

**Grid System:**
- Dashboard items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- File metadata: Two-column layout on desktop (60/40 split)

---

## Core Components

### Navigation Header
- Fixed top bar with max-w-7xl container
- Logo/Brand on left (text-2xl font-bold)
- Navigation items right-aligned with gap-8
- Height: h-16, subtle bottom border
- Sticky positioning: sticky top-0 with backdrop blur

### Upload Zone (Hero Section)
- Prominent drag-and-drop area occupying upper viewport
- Large upload icon (heroicons: cloud-arrow-up, size w-16 h-16)
- Centered layout with vertical spacing of space-y-6
- Dashed border (border-2 border-dashed) with rounded-2xl
- Padding: p-12 md:p-16
- Hover state: Slight scale transform and border emphasis
- File type indicators below (HTML, CSS, JS, ZIP with icons)
- Size limit display: text-sm below upload area

### Upload Button/CTA
- Primary action: px-8 py-4 rounded-lg text-lg font-semibold
- Icon integration: Upload icon to left of text with mr-3
- Smooth transition on all states
- Shadow: shadow-lg with hover:shadow-xl

### Success State Modal/Card
- Centered overlay with backdrop blur
- Card: max-w-2xl rounded-2xl with p-8
- Success icon at top (heroicons: check-circle, w-20 h-20)
- Generated URL display in monospace font with copy button
- URL container: p-4 rounded-lg with border
- Action buttons below: Visit Site (primary) and Back to Dashboard (secondary)

### Dashboard Section
- Section header with count badge: "Your Hosted Sites (3)"
- Grid layout for site cards
- Empty state: Centered message with upload prompt icon

### Site Card Component
- Rounded-xl with border and padding p-6
- Hover: Subtle lift with shadow transition
- Layout structure:
  - Top: Site name/filename (text-lg font-semibold truncate)
  - Middle: Metadata row (date, file type, size) with gap-4
  - URL display: Monospace with copy button (inline flex)
  - Bottom: Action buttons row (Visit, Delete) with gap-2
- Status indicator: Small dot for "active" sites

### Button Variants
- Primary: Solid fill, rounded-lg, px-6 py-3, font-medium
- Secondary: Border style, same sizing
- Danger: Used for delete actions
- Icon-only: Square aspect (w-10 h-10) rounded-md
- Copy button: Icon with hover tooltip

### Input/Form Elements
- Consistent height: h-12
- Rounded corners: rounded-lg
- Border width: border-2
- Padding: px-4
- Font size: text-base
- Focus ring: ring-2 ring-offset-2

### File Type Badges
- Small pills: px-3 py-1 rounded-full text-xs font-semibold
- Different styles for HTML, CSS, JS, ZIP
- Icon prefix with mr-2

### Metadata Display
- Icon + text pairs with gap-2
- Icons from Heroicons: calendar, document, folder, link
- Flex layout with items-center
- Muted text color hierarchy

---

## Page Layouts

### Homepage Structure
1. **Header Navigation** (h-16)
2. **Upload Hero** (min-h-[500px], centered content)
   - Title + description
   - Upload dropzone (primary focus)
   - Supported formats list
   - Size limit notice
3. **Dashboard Section** (py-16)
   - Section header with count
   - Grid of site cards
   - Empty state if no uploads

### Site View Page (/site/:id)
- Minimal chrome: Small header with "Powered by MeryHost" branding
- Full-width content rendering
- Optional: Metadata footer strip (optional toggle)

---

## Interaction Patterns

**Drag-and-Drop:**
- Clear visual feedback on dragover (border emphasis, background shift)
- File icon appears in center during drag
- Smooth transitions (transition-all duration-200)

**Copy URL Functionality:**
- Click to copy with instant feedback
- Icon swap: clipboard → check (0.3s)
- Tooltip: "Copied!" appearing above button

**Delete Confirmation:**
- Modal overlay with confirmation message
- Two-button layout: Cancel (secondary) + Delete (danger)
- No slide-out transitions - instant modal appearance

**Loading States:**
- Upload progress: Linear progress bar beneath upload zone
- Processing indicator: Spinner with "Processing upload..." text
- Skeleton screens for dashboard loading

---

## Responsive Behavior

**Mobile (< 768px):**
- Single column layouts throughout
- Upload zone: Reduced padding (p-6)
- Stacked buttons in site cards
- Hamburger menu for navigation

**Tablet (768px - 1024px):**
- Two-column grid for site cards
- Maintained spacing hierarchy

**Desktop (> 1024px):**
- Three-column grid for site cards
- Maximum container width enforcement
- Generous whitespace

---

## Accessibility Implementation

- All interactive elements: Proper focus states with ring-2
- Form labels: Associated with inputs (for/id pairing)
- Icon buttons: aria-label attributes
- Skip to main content link
- Keyboard navigation: Tab order follows visual hierarchy
- Error messages: role="alert" for screen readers
- Sufficient contrast ratios throughout

---

## Icon Library

**Selected: Heroicons (Outline variant via CDN)**

Key icons used:
- cloud-arrow-up (upload)
- check-circle (success)
- document, folder (file types)
- link, clipboard (URL actions)
- trash (delete)
- x-mark (close modals)