# SparkCircle Design System & Style Guide

## Typography

### Font Families
- **Headlines & Titles**: `Instrument Serif, serif`
- **Body Text & UI**: `Inter, sans-serif`

### Font Imports
Always include this Google Fonts link in components:
```html
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap
```

### Typography Scale
- **Hero Text**: `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`
- **Section Headers**: `text-3xl sm:text-4xl md:text-5xl`
- **Manifesto Text**: `text-xl sm:text-2xl md:text-3xl`
- **Body Text**: `text-sm sm:text-base`
- **Small Text**: `text-xs sm:text-sm`

### Font Weights
- **Instrument Serif**: Use `400` (normal) for all headings
- **Inter**: Range from `300` (light) to `700` (bold)

## Color Palette

### Primary Colors
- **Background**: `#F9F3EF` (warm off-white)
- **Text Primary**: `#151B1E` (dark charcoal)
- **Text Secondary**: `#gray-600` / `#gray-700`

### Accent Colors
- **Warm Yellow**: `#FFE7C6` (from gradient, used for secondary buttons)
- **Light Cream**: `#FFF8F0` (secondary card backgrounds)
- **Warm Amber**: `#E5A866` (bullet points, subtle accents)

### Gradient Combinations
- **Card Backgrounds**: `linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)`
- **Animated Text**: `linear-gradient(45deg, #8B5CF6, #EC4899, #F97316, #10B981, #3B82F6, #8B5CF6)`

### Interactive Elements
- **Buttons Primary**: `bg-gray-800` with `hover:bg-black`
- **Buttons Secondary**: `bg-gray-800` with `hover:bg-gray-700`
- **Input Focus**: `focus:ring-gray-400`

## Spacing System

### Responsive Spacing
Use Tailwind's responsive prefixes consistently:
- **Small margins**: `mb-4 sm:mb-6`
- **Medium margins**: `mb-12 sm:mb-24`
- **Large margins**: `mt-16 sm:mt-24`
- **Padding**: `p-6 sm:p-8` for cards

### Layout Containers
- **Max Width**: `max-w-6xl mx-auto` for main content
- **Narrow Content**: `max-w-4xl mx-auto` for text sections
- **Form Elements**: `max-w-4xl mx-auto` for action cards

## Component Patterns

### Cards

#### Primary Cards
```css
{
  borderRadius: 'rounded-2xl sm:rounded-3xl',
  background: 'linear-gradient(135deg, #FFE7C6 0%, #EADAF6 100%)',
  minHeight: '380px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column'
}
```

#### Secondary/Complementary Cards
```css
{
  borderRadius: 'rounded-2xl sm:rounded-3xl',
  padding: 'p-6 sm:p-8',
  backgroundColor: '#FFF8F0',
  border: '1px solid rgba(255, 231, 198, 0.5)'
}
```

**Usage Guidelines:**
- Primary cards for main actions (Create/Join forms)
- Secondary cards for supplementary information
- Maintain visual hierarchy with lighter colors for secondary content

### Buttons

#### Primary Buttons
```css
{
  width: 'w-full',
  background: 'bg-gray-800',
  color: 'text-white',
  fontWeight: 'font-medium',
  padding: 'py-3 px-8 sm:py-4 sm:px-10',
  borderRadius: 'rounded-full',
  hover: 'hover:bg-black',
  transition: 'transition-all',
  fontSize: 'text-sm md:text-base sm:text-base',
  fontFamily: 'Inter, sans-serif'
}
```

#### Secondary Buttons
```css
{
  width: 'w-full',
  backgroundColor: '#FFE7C6',
  color: 'text-gray-800',
  fontWeight: 'font-medium',
  padding: 'py-3 px-6',
  borderRadius: 'rounded-full',
  hover: 'hover:opacity-90',
  transition: 'transition-all',
  fontSize: 'text-sm',
  fontFamily: 'Inter, sans-serif'
}
```

### Input Fields
```css
{
  width: 'w-full',
  padding: 'px-3 py-3 sm:px-4 sm:py-4',
  background: 'bg-white/70 backdrop-blur-sm',
  borderRadius: 'rounded-full',
  placeholder: 'placeholder-gray-500',
  textAlign: 'text-center',
  fontSize: 'text-sm sm:text-base',
  fontWeight: 'font-medium',
  focus: 'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white/90',
  transition: 'transition-all',
  fontFamily: 'Inter, sans-serif'
}
```

### Feature Pills (Deprecated)
*Note: Feature pills have been replaced with minimal list items in current design*

### List Items & Steps
```css
{
  /* Bullet point */
  bulletSize: 'w-1.5 h-1.5',
  bulletShape: 'rounded-full',
  bulletColor: '#E5A866', /* Warm amber for accent */
  bulletSpacing: 'mt-2',
  
  /* Text */
  textColor: 'text-gray-600',
  textSize: 'text-xs sm:text-sm',
  fontFamily: 'Inter, sans-serif',
  
  /* Layout */
  spacing: 'space-y-2 sm:space-y-3',
  alignment: 'flex items-start space-x-3'
}
```

**Usage:**
- Use for step-by-step instructions
- Help text and supplementary information
- Keep text concise and actionable

## Layout Patterns

### Navigation
- **Fixed positioning**: `fixed top-0 left-0 right-0`
- **Z-index**: `z-50`
- **Logo size**: `w-28 h-14 sm:w-40 sm:h-20` (smaller on mobile)
- **Nav links**: Small, subtle styling with hover states
- **Mobile menu**: Hamburger menu with smooth transitions
- **Scroll fade**: Opacity decreases with scroll using `transition-opacity duration-300`

### Hero Section
- **Positioning**: `fixed sm:relative` (fixed on mobile for overlay effect)
- **Centered content**: `flex items-center justify-center`
- **Responsive padding**: `pt-32 sm:pt-32 pb-32 sm:pb-32`
- **Animated text**: Use rotating words with smooth transitions
- **Mobile fade**: Opacity decreases with scroll (300px range) using `transition-opacity duration-300`
- **Mobile spacer**: Add `h-60 sm:h-0` spacer div after fixed hero for content flow

### Grid Systems
- **Two-column cards**: `grid md:grid-cols-2 gap-4 sm:gap-6`
- **Feature pills**: `flex flex-wrap justify-center gap-2 sm:gap-3`

### Footer
The standard footer should be used consistently across all pages:

```jsx
{/* Footer */}
<div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
  <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
    👋🏻 hello@sparkcircle.com
  </p>
  <p className="text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
    © 2025 SparkCircle. All rights reserved.
  </p>
</div>
```

**Footer Specifications:**
- **Positioning**: Centered text alignment
- **Spacing**: `mt-8 sm:mt-12` top margin (reduced for tighter layouts), `pt-6 sm:pt-8` top padding
- **Border**: Top border with `border-gray-200`
- **Typography**: 
  - Email: `text-sm` in `text-gray-600` with Inter font
  - Copyright: `text-xs` in `text-gray-400` with Inter font
- **Content**: Contact email with waving emoji, copyright notice with current year

## Animation & Interactions

### Keyframe Animations
```css
@keyframes slotMachineSlide {
  0% { transform: translateY(-30px); opacity: 0; }
  50% { transform: translateY(2px); opacity: 0.7; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Mobile Hamburger Menu
```css
.hamburger-line {
  width: 20px;
  height: 2px;
  background-color: #374151;
  transition: all 0.3s ease;
  margin: 3px 0;
}

.hamburger-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}
```

### Transition Classes
- **Smooth transitions**: `transition-all`
- **Word width changes**: `transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover effects**: `hover:shadow-md`, `hover:bg-black`

## Responsive Design

### Breakpoints
- **Small**: `sm:` (640px+)
- **Medium**: `md:` (768px+)
- **Large**: `lg:` (1024px+)

### Responsive Patterns
1. **Text scaling**: Always provide multiple size variants
2. **Spacing scaling**: Use responsive margins and padding
3. **Grid adaptation**: Single column on mobile, multi-column on desktop
4. **Image sizing**: Provide multiple sizes for different screens
5. **Mobile-first positioning**: Use `fixed sm:relative` for overlay effects
6. **Scroll-based fading**: Implement opacity changes based on scroll position
7. **Mobile navigation**: Replace desktop nav with hamburger menu on small screens

## Asset Guidelines

### Images
- **Mascots**: Position with `absolute -top-8 sm:-top-10 right-3 sm:right-5`
- **Logo**: SVG format, consistent sizing across components
- **Icons**: Use emoji or simple SVG icons in feature pills

### File Organization
- Keep all images in `/public/images/`
- Use descriptive filenames (e.g., `host-mascot.png`, `join-mascot.png`)

## Accessibility

### Color Contrast
- Ensure text meets WCAG guidelines against background colors
- Use sufficient opacity for secondary text (`opacity: 0.8`)

### Interactive Elements
- Provide disabled states for buttons
- Use proper focus indicators
- Ensure keyboard navigation works

### Semantic HTML
- Use proper heading hierarchy
- Include meaningful alt text for images
- Use semantic form elements

## Code Style

### CSS-in-JS Patterns
When using inline styles (for colors not in Tailwind):
```javascript
style={{ 
  color: '#151B1E', 
  fontFamily: 'Instrument Serif, serif',
  lineHeight: '1.1',
  fontWeight: '400'
}}
```

### Class Naming
- Use Tailwind utility classes as primary approach
- Group related classes logically
- Use responsive prefixes consistently
- Combine with style objects for custom values

### Component Structure
1. State and hooks at top (including mobile-specific state like `navOpacity`, `heroOpacity`)
2. Event handlers
3. Effects and lifecycle (including scroll listeners for fade effects)
4. Render with clear JSX structure
5. Inline styles for custom values only

### Mobile-Specific Implementation Patterns
```javascript
// Scroll-based opacity state
const [navOpacity, setNavOpacity] = useState(1);
const [heroOpacity, setHeroOpacity] = useState(1);

// Scroll handler for fade effects
const handleScroll = () => {
  const scrollY = window.scrollY;
  const newNavOpacity = Math.max(0, 1 - scrollY / 50); // Fast fade for navigation
  const newHeroOpacity = Math.max(0, 1 - scrollY / 300); // Slower fade for hero
  setNavOpacity(newNavOpacity);
  setHeroOpacity(newHeroOpacity);
};

// Conditional opacity application
style={{ 
  opacity: window.innerWidth < 640 ? heroOpacity : 1 
}}
```

**Fade Timing Guidelines:**
- Navigation: 50px scroll distance (fast fade)
- Hero sections: 300px scroll distance (gradual fade)
- Apply only on mobile (`< 640px`)

## Usage Guidelines

### Do's
- ✅ Use Instrument Serif for all headings and titles
- ✅ Use Inter for all body text and UI elements
- ✅ Maintain consistent spacing using the responsive system
- ✅ Follow the established color palette
- ✅ Use the card pattern for major content sections
- ✅ Implement smooth transitions for all interactive elements
- ✅ Use fixed positioning with fade effects for mobile hero sections
- ✅ Implement hamburger menus for mobile navigation
- ✅ Add appropriate spacer elements when using fixed positioning

### Don'ts
- ❌ Mix other font families without approval
- ❌ Use arbitrary colors outside the established palette
- ❌ Skip responsive breakpoints for text and spacing
- ❌ Create new component patterns without documenting them
- ❌ Use hard-coded pixel values instead of Tailwind classes
- ❌ Forget to add spacer elements when using fixed positioning on mobile
- ❌ Apply mobile-specific effects (like fade) to desktop without conditions
- ❌ Skip transition classes when implementing opacity changes

## Card Layout Patterns

### Two-Card Layout
For pages with primary actions and supplementary information:
1. **Primary card**: Main action (Create/Join form) with gradient background
2. **Secondary card**: Help text or next steps with neutral cream background
3. **Spacing**: `mt-6 sm:mt-8` between cards
4. **Visual hierarchy**: Primary cards use gradients, secondary cards use solid colors

## File References

This style guide is based on the design patterns established in:
- `frontend/src/pages/LandingPage.js` (primary reference)
- `frontend/src/pages/CreateRoom.js` (two-card layout pattern)
- `frontend/src/pages/JoinRoom.js` (secondary card styling)

When implementing new components, refer back to these files for consistent patterns and styling approaches. 