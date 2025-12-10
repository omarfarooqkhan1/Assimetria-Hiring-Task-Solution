# Design Guidelines: Auto-Generated Blog Platform

## Design Approach
**System-Based with Editorial Polish**: Utilizing a clean, content-first design system inspired by Medium, Ghost, and Notion's publishing platforms, emphasizing readability and professional presentation while showcasing modern web development capabilities.

## Core Design Principles
1. **Content is King**: Typography and spacing prioritize comfortable reading
2. **Editorial Clarity**: Clear visual hierarchy guides users through content
3. **Professional Polish**: Production-ready appearance demonstrating technical excellence
4. **Purposeful Simplicity**: Every element serves the reading experience

---

## Typography System

**Font Families** (via Google Fonts):
- **Headlines**: Inter (weights: 600, 700, 800)
- **Body Text**: Inter (weights: 400, 500)
- **Code/Metadata**: JetBrains Mono (weight: 400)

**Type Scale**:
- Hero Title: text-5xl md:text-6xl font-bold
- Article Title (List): text-2xl md:text-3xl font-semibold
- Article Title (Detail): text-4xl md:text-5xl font-bold
- Section Headers: text-xl md:text-2xl font-semibold
- Body Text: text-base md:text-lg leading-relaxed
- Metadata/Labels: text-sm font-medium
- Captions: text-xs text-opacity-60

---

## Layout System

**Spacing Units**: Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24, 32 consistently
- Component padding: p-6 md:p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-8 md:gap-12
- Element margins: mb-4, mb-6, mb-8 for vertical rhythm

**Container Strategy**:
- Full-width sections: w-full
- Content containers: max-w-6xl mx-auto px-6
- Article content: max-w-3xl mx-auto (optimal reading width ~65-75 characters)
- Wide content: max-w-5xl mx-auto

---

## Component Library

### Navigation Header
- Fixed/sticky header with blur backdrop effect
- Logo/brand on left, minimal nav items on right
- Height: h-16 md:h-20
- Includes: "All Articles" link, subtle divider, GitHub link
- Shadow on scroll for depth

### Article List Page
**Hero Section**:
- Centered title + subtitle introducing the automated blog concept
- Brief description: "Daily articles on technology, science, and innovation"
- Height: 60vh with centered content

**Article Grid**:
- 2-column layout on desktop (grid-cols-1 md:grid-cols-2), single column mobile
- Each card contains:
  - Featured placeholder image area (aspect-video, gradient background)
  - Article title (text-2xl font-semibold)
  - Excerpt/summary (2-3 lines, text-opacity-70)
  - Metadata bar: Generated date, reading time estimate, category tag
  - Subtle hover elevation (transform scale + shadow)
- Gap between cards: gap-8
- Load more button at bottom if needed

### Article Detail Page
**Article Header**:
- Full-width container (max-w-4xl)
- Article title (text-4xl md:text-5xl font-bold)
- Publication metadata row: Date, reading time, generation method
- Spacing: mb-12

**Article Content**:
- Constrained width for readability (max-w-3xl)
- Generous line-height (leading-relaxed)
- Paragraph spacing: mb-6
- Proper heading hierarchy within content
- Back button/navigation breadcrumb above title

### Footer
- Simple centered layout
- Contains: Copyright, "Automated Content" badge, social/GitHub links
- Divider line above
- Padding: py-12

---

## Visual Patterns

**Cards**:
- Border: border border-opacity-10
- Rounded corners: rounded-lg md:rounded-xl
- Padding: p-6 md:p-8
- Hover state: slight scale (scale-[1.02]) + shadow increase
- Transition: transition-all duration-300

**Buttons**:
- Primary: Solid with comfortable padding (px-6 py-3)
- Secondary: Outline variant
- Rounded: rounded-lg
- Font: font-medium

**Loading States**:
- Skeleton loaders for article cards during fetch
- Shimmer animation on placeholder elements

**Empty States**:
- Centered message when no articles exist
- Illustration/icon + helpful text

---

## Images

### Hero Section
Large abstract/tech-themed gradient background (not a photo) with overlay for text readability. Subtle pattern or mesh gradient suggesting AI/automation.

### Article Cards
Each article card should have a placeholder image area with:
- Gradient backgrounds (different per article using hash-based color generation)
- Abstract geometric patterns or generated imagery placeholders
- Aspect ratio: 16:9 (aspect-video)
- Rounded corners matching card style

### Article Detail
Optional featured image at top of article content (same style as card images)

---

## Interaction Design

**Micro-interactions**:
- Smooth page transitions
- Card hover effects (elevation + scale)
- Button hover states (slight darken/brighten)
- Link underlines on hover

**Navigation**:
- Instant feedback on clicks
- Smooth scroll to top when navigating
- Browser back button support

**Responsive Behavior**:
- Mobile: Single column, full-width cards, larger touch targets
- Tablet: 2-column grid, comfortable spacing
- Desktop: Optimized reading width, ample whitespace

---

## Accessibility Requirements
- ARIA labels on interactive elements
- Semantic HTML (article, header, nav, main, footer)
- Focus indicators on keyboard navigation
- Readable contrast ratios (WCAG AA minimum)
- Alt text placeholders for images

---

This design creates a professional, polished blog platform that demonstrates production-quality development while maintaining focus on the content and reading experience.