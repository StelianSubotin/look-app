export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  readTime: number
  relatedTools?: string[]
  relatedArticles?: string[]
  publishedAt: string
}

export const categories = [
  { id: "typography", name: "Typography", icon: "Type" },
  { id: "color", name: "Color Theory", icon: "Palette" },
  { id: "layout", name: "Layout & Composition", icon: "Layout" },
  { id: "ui-ux", name: "UI/UX Principles", icon: "Monitor" },
  { id: "accessibility", name: "Accessibility", icon: "Eye" },
  { id: "design-systems", name: "Design Systems", icon: "Layers" },
]

export const articles: Article[] = [
  {
    id: "1",
    slug: "typography-fundamentals",
    title: "Typography Fundamentals: The Foundation of Great Design",
    excerpt: "Master the core principles of typography to create readable, accessible, and beautiful text layouts.",
    category: "typography",
    readTime: 8,
    relatedTools: ["design-system-generator"],
    relatedArticles: ["font-pairing-guide", "responsive-typography"],
    publishedAt: "2024-01-15",
    content: `Typography is the art and technique of arranging type to make written language legible, readable, and appealing. It's one of the most critical aspects of design, yet it's often overlooked or misunderstood.

## The Anatomy of Type

Understanding typography starts with knowing the basic components of letterforms. Each letter consists of various elements:

**Baseline**: The invisible line on which letters sit. This is your reference point for alignment.

**Cap Height**: The height of capital letters from the baseline. This defines the vertical proportion of your typeface.

**X-Height**: The height of lowercase letters (specifically the letter 'x'). A larger x-height generally makes text more readable at smaller sizes.

**Ascenders and Descenders**: Parts of letters that extend above the x-height (like 'h' and 'b') or below the baseline (like 'p' and 'g').

**Kerning**: The space between individual letter pairs. Good kerning creates visual balance.

**Leading**: The vertical space between lines of text. Named after the strips of lead that were placed between lines of type in traditional printing.

**Tracking**: The overall spacing between all characters in a block of text.

## Choosing the Right Typeface

Selecting appropriate typefaces is crucial for effective communication. Consider these factors:

**Context and Purpose**: A playful script font might work for a wedding invitation but would be inappropriate for a legal document. Match your typeface to your message and audience.

**Readability vs. Legibility**: Legibility refers to how easily individual characters can be distinguished. Readability is about how easy it is to read blocks of text. Both are important but serve different purposes.

**Mood and Personality**: Typefaces carry emotional weight. Serif fonts often feel traditional and trustworthy. Sans-serifs feel modern and clean. Display fonts can be playful, serious, elegant, or bold.

## The Rule of Three

A good rule of thumb is to use no more than three typefaces in a single design:
- One for headings
- One for body text
- One for special emphasis or UI elements

Often, you can achieve great results with just one typeface family by using different weights and styles (bold, italic, etc.).

## Hierarchy Through Type

Typography creates visual hierarchy, guiding readers through your content:

**Size**: Larger text naturally draws attention first. Use this to establish importance.

**Weight**: Bold text stands out from regular weight. Use it for emphasis and headings.

**Color**: High contrast text (like black on white) demands attention. Lower contrast can be used for supporting information.

**Spacing**: More white space around text makes it feel more important and easier to focus on.

## Practical Guidelines

**Body Text**: 16-18px is ideal for web body text. Smaller sizes strain the eyes.

**Line Length**: 50-75 characters per line is optimal for readability. Longer lines make it hard to track to the next line.

**Line Height**: 1.4-1.6 times the font size for body text creates comfortable reading. Headings can be tighter.

**Contrast**: Ensure sufficient contrast between text and background. Use tools to check WCAG compliance.

Remember: Typography is not just about making things look beautiful—it's about making information accessible and easy to understand. Great typography is invisible; it serves the content without calling attention to itself.`
  },
  {
    id: "2",
    slug: "color-theory-basics",
    title: "Color Theory: Understanding the Psychology and Science of Color",
    excerpt: "Learn how to choose, combine, and apply colors effectively in your designs using proven color theory principles.",
    category: "color",
    readTime: 10,
    relatedTools: ["palette-generator", "contrast-checker"],
    relatedArticles: ["creating-color-palettes", "accessible-color-contrast"],
    publishedAt: "2024-01-20",
    content: `Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, guide attention, establish hierarchy, and reinforce brand identity. Understanding color theory is essential for creating effective, harmonious designs.

## The Color Wheel

The foundation of color theory is the color wheel, organizing colors in a circular format:

**Primary Colors**: Red, Yellow, and Blue. These cannot be created by mixing other colors.

**Secondary Colors**: Orange, Green, and Purple. Created by mixing two primary colors.

**Tertiary Colors**: Created by mixing a primary and adjacent secondary color (red-orange, yellow-green, etc.).

## Color Properties

Every color has three key properties:

**Hue**: The pure color itself (red, blue, green, etc.). This is what we typically think of as "color."

**Saturation**: The intensity or purity of the color. Highly saturated colors are vivid and pure. Desaturated colors appear more muted or gray.

**Lightness/Value**: How light or dark the color is. Adding white creates tints, adding black creates shades.

Understanding these properties allows you to create sophisticated color variations and ensure consistency across your palette.

## Color Harmony

Color harmonies are tried-and-true combinations that create pleasing visual relationships:

**Complementary**: Colors opposite on the color wheel (red and green, blue and orange). These create high contrast and vibrant looks but can be overwhelming if overused.

**Analogous**: Colors next to each other on the wheel (blue, blue-green, green). These create serene, comfortable designs with low contrast.

**Triadic**: Three colors evenly spaced on the wheel (red, yellow, blue). This provides vibrant contrast while maintaining harmony.

**Split-Complementary**: A color plus the two colors adjacent to its complement. Offers high contrast with more nuance than pure complementary.

**Monochromatic**: Variations of a single hue using different saturations and values. Creates cohesive, sophisticated designs.

## Color Psychology

Colors carry psychological and cultural meanings:

**Red**: Energy, passion, urgency, danger. Stimulating and attention-grabbing. Use for calls-to-action or warnings.

**Blue**: Trust, calm, professionalism, stability. The most universally liked color. Common in corporate and financial brands.

**Yellow**: Optimism, happiness, warmth, caution. Energizing but can strain the eyes. Use sparingly or in muted tones.

**Green**: Growth, nature, health, money. Calming and balanced. Popular for environmental and wellness brands.

**Purple**: Luxury, creativity, wisdom, spirituality. Often used for premium products or creative services.

**Orange**: Enthusiasm, confidence, friendliness. Less aggressive than red but still energetic.

**Black**: Sophistication, elegance, power, formality. Used for luxury brands and to create drama.

**White**: Purity, simplicity, cleanliness, space. Essential for creating breathing room and focus.

## Practical Application

**60-30-10 Rule**: Use your dominant color 60% of the time, secondary color 30%, and accent color 10%. This creates balance and prevents color overload.

**Start with Grayscale**: Design in black and white first. If your design works without color, adding color will only enhance it.

**Test Accessibility**: Always check color contrast ratios. Text must be readable for everyone, including those with visual impairments.

**Consider Context**: Colors appear different depending on their surroundings. A gray can look warm next to blue or cool next to orange.

**Use Color with Purpose**: Every color choice should support your message and guide user behavior. Don't add color just for decoration.

## Cultural Considerations

Remember that color meanings vary across cultures:
- White symbolizes purity in Western cultures but mourning in some Eastern cultures
- Red means danger in the West but luck and celebration in China
- Blue is masculine in some cultures but not others

When designing for global audiences, research color symbolism in your target markets.

Color theory provides the foundation, but great color usage also requires experimentation, testing, and refinement. Use these principles as a starting point, then trust your eye and gather user feedback.`
  },
  {
    id: "3",
    slug: "layout-composition-principles",
    title: "Layout & Composition: Creating Visual Hierarchy and Balance",
    excerpt: "Master the principles of visual composition to create layouts that guide users naturally through your content.",
    category: "layout",
    readTime: 9,
    relatedTools: ["component-finder"],
    relatedArticles: ["grid-systems", "whitespace-importance"],
    publishedAt: "2024-01-25",
    content: `Great layout and composition are the invisible structures that make designs feel organized, intentional, and easy to navigate. Understanding these principles is crucial for creating effective digital experiences.

## The Principles of Composition

**Balance**: The distribution of visual weight in a design. Symmetrical balance creates stability and formality. Asymmetrical balance is dynamic and modern but requires careful attention to visual weight.

**Contrast**: Difference between elements. Use contrast to create emphasis, guide attention, and establish hierarchy. This applies to size, color, shape, texture, and spacing.

**Emphasis**: Drawing attention to the most important elements. Every design needs a focal point—the thing you want users to see first.

**Repetition**: Using consistent elements throughout a design creates unity and helps users understand patterns and relationships.

**Proportion**: The relative size of elements to each other and to the whole. Good proportion creates harmony and helps establish importance.

**Movement**: The path a viewer's eye takes through a design. Use composition to guide users naturally through your content in the right order.

**White Space (Negative Space)**: The empty space around and between elements. It's not "wasted" space—it's essential for clarity, focus, and elegance.

## The Rule of Thirds

Divide your layout into a 3×3 grid. Place important elements along these lines or at their intersections. This creates more dynamic, interesting compositions than centering everything.

This principle comes from photography but applies perfectly to UI design. It creates natural focal points and prevents boring, static layouts.

## Visual Hierarchy

Hierarchy tells users where to look first, second, and third:

**Size**: Larger elements demand more attention. Use this to establish importance clearly.

**Position**: Items at the top or left (in left-to-right languages) are seen first. The center also attracts attention.

**Color**: High contrast colors stand out. Use your brand's primary color strategically to guide attention.

**Spacing**: Elements with more space around them appear more important.

**Typography**: Variations in font size, weight, and style create clear information hierarchy.

## The F-Pattern and Z-Pattern

Research shows users scan web pages in predictable patterns:

**F-Pattern**: Used for text-heavy pages. Users scan the top horizontally, then down the left side, occasionally scanning right. Place key information along this path.

**Z-Pattern**: Used for less text-heavy designs. Users scan top-left to top-right, diagonal to bottom-left, then across to bottom-right. Good for landing pages with clear calls-to-action.

Understanding these patterns helps you place content where users naturally look.

## Grid Systems

Grids provide structure and consistency:

**Column Grids**: Most common for web design. 12-column grids offer flexibility for responsive layouts.

**Modular Grids**: Rows and columns create modules. Good for content-heavy designs with multiple content types.

**Baseline Grids**: Aligns text baselines for vertical rhythm. Creates polished, professional typography.

Using grids doesn't mean designs must feel rigid. Grids provide structure, but you can break them intentionally for emphasis.

## Proximity and Grouping

Elements that are close together are perceived as related. Use proximity to:
- Group related information
- Separate different sections
- Show relationships between elements

Don't rely on borders and lines to separate content. White space is often more effective.

## Alignment

Everything should align to something. Random placement creates chaos and looks unprofessional.

**Edge Alignment**: Aligning elements to common edges creates clean, organized layouts.

**Center Alignment**: Can work for simple content but often feels static. Use sparingly.

**Baseline Alignment**: Aligning text baselines creates sophisticated typography.

Good alignment is often invisible to users but its absence is immediately noticeable.

## Responsive Considerations

Modern layouts must work across all screen sizes:

**Mobile-First**: Start with the mobile layout, then expand for larger screens. This ensures your content hierarchy works at the most constrained size.

**Flexible Grids**: Use percentage-based widths rather than fixed pixels.

**Content Reflow**: Plan how elements stack and reorder on different screen sizes.

**Touch Targets**: Ensure buttons and interactive elements are large enough for fingers (minimum 44×44px).

## Common Layout Patterns

**Hero Section**: Large banner with key message and call-to-action. Immediately communicates purpose.

**Feature Grid**: Showcasing multiple features or products. Use cards for scannable, digestible content.

**Sidebar Layout**: Main content with supplementary information aside. Good for documentation or blogs.

**Dashboard Layout**: Data-dense interfaces with multiple panels. Requires careful hierarchy and organization.

The best layouts feel effortless. Users should naturally understand where to look and how to navigate without conscious thought. This comes from applying these principles consistently and testing with real users.`
  },
  {
    id: "4",
    slug: "accessible-design-principles",
    title: "Accessible Design: Creating Inclusive Digital Experiences",
    excerpt: "Learn how to design for everyone, including users with disabilities, following WCAG guidelines and best practices.",
    category: "accessibility",
    readTime: 12,
    relatedTools: ["contrast-checker"],
    relatedArticles: ["wcag-guidelines", "screen-reader-design"],
    publishedAt: "2024-02-01",
    content: `Accessibility isn't optional—it's essential. Approximately 15% of the world's population has some form of disability. Accessible design ensures everyone can use your products, regardless of their abilities.

## Why Accessibility Matters

**Legal Requirements**: Many countries have laws requiring digital accessibility (ADA in the US, EAA in EU).

**Business Case**: Accessible sites reach a larger audience, improve SEO, and often provide better experiences for everyone.

**Ethical Responsibility**: Everyone deserves equal access to information and services.

**Better UX for All**: Accessibility improvements often benefit all users, not just those with disabilities.

## Types of Disabilities to Consider

**Visual**: Blindness, low vision, color blindness. Users may use screen readers, screen magnifiers, or high-contrast modes.

**Auditory**: Deafness or hard of hearing. Users need captions, transcripts, and visual alternatives to audio cues.

**Motor**: Limited fine motor control, inability to use a mouse. Users may rely on keyboard navigation, voice control, or assistive devices.

**Cognitive**: Learning disabilities, memory issues, attention disorders. Users need clear language, consistent patterns, and minimal distractions.

**Temporary and Situational**: Broken arm, bright sunlight, noisy environment. Good accessibility helps in these situations too.

## WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) provide standards for accessible design:

### Level A (Minimum)
- Provide text alternatives for images
- Offer captions for videos
- Ensure content is keyboard-accessible
- Don't use color alone to convey information

### Level AA (Recommended)
- Meet contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Ensure text can be resized to 200%
- Make navigation consistent across pages
- Provide clear error messages

### Level AAA (Enhanced)
- Higher contrast ratios (7:1 for normal text)
- No background audio in speech content
- Very thorough sign language interpretation

Most organizations aim for Level AA compliance as a good balance of accessibility and feasibility.

## Color and Contrast

**Sufficient Contrast**: Text must be readable against its background. Use contrast checkers to verify ratios.

**Don't Rely on Color Alone**: Use icons, patterns, or text labels alongside color coding.

**Test for Color Blindness**: About 8% of men and 0.5% of women have color vision deficiencies. Test your designs with color blindness simulators.

**Avoid Pure Red and Green**: These are particularly problematic for the most common types of color blindness.

## Keyboard Navigation

All functionality must be accessible via keyboard alone:

**Tab Order**: Users should be able to tab through interactive elements in a logical order.

**Focus Indicators**: Always show a clear visual indicator of which element has keyboard focus. Never remove outline without providing an alternative.

**Skip Links**: Provide a way to skip repetitive content (like navigation) to jump straight to main content.

**Keyboard Shortcuts**: Provide shortcuts for common actions, but ensure they don't conflict with screen reader commands.

## Screen Reader Considerations

**Semantic HTML**: Use proper heading hierarchy (h1, h2, h3). Use semantic elements like <nav>, <main>, <article>.

**Alt Text**: Write descriptive alt text for images. Explain the content and function, not just what you see. Decorative images should have empty alt attributes.

**ARIA Labels**: Use ARIA labels when semantic HTML isn't sufficient. But remember: No ARIA is better than bad ARIA.

**Link Text**: Make link text descriptive. "Click here" is not helpful. "Download the accessibility guide (PDF)" is clear.

**Form Labels**: Every form field needs a visible, programmatically associated label.

## Content and Language

**Clear Language**: Use simple, direct language. Avoid jargon and unexplained abbreviations.

**Readability**: Break up long paragraphs. Use headings, lists, and white space to create scannable content.

**Instructions**: Don't assume users can see visual indicators. Provide text instructions alongside visual cues.

**Error Messages**: Clearly explain what went wrong and how to fix it. Don't just say "Error in field 3."

## Motion and Animation

**Respect Preferences**: Check for prefers-reduced-motion and reduce or remove animations accordingly.

**Provide Controls**: Allow users to pause, stop, or hide moving content.

**Avoid Flashing**: Never flash content more than three times per second. It can trigger seizures.

## Testing Your Design

**Keyboard Only**: Try using your interface without a mouse.

**Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac/iOS).

**Color Tools**: Use contrast checkers and color blindness simulators.

**Real Users**: The best testing involves people with actual disabilities.

**Automated Tools**: Use tools like axe DevTools or WAVE, but don't rely on them exclusively.

## Common Mistakes to Avoid

- Using empty links or buttons
- Missing alt text or using filenames as alt text
- Poor color contrast
- Unlabeled form fields
- Keyboard traps (user can tab in but not out)
- Auto-playing media
- Time limits without warning
- Non-semantic HTML for layout
- Removing focus indicators
- Images of text instead of actual text

## Making It Part of Your Process

Accessibility should be considered from the start, not retrofitted:

**Design Phase**: Choose accessible colors, plan keyboard navigation, design clear focus states.

**Development Phase**: Use semantic HTML, add ARIA where needed, implement keyboard functionality.

**Testing Phase**: Test with assistive technologies and real users.

**Ongoing**: Accessibility is not a one-time checklist. Monitor and improve continuously.

Remember: Accessible design is better design. The constraints of accessibility often lead to clearer, simpler, more usable interfaces for everyone.`
  },
  {
    id: "5",
    slug: "design-system-fundamentals",
    title: "Building Design Systems: Creating Consistency at Scale",
    excerpt: "Learn how to build and maintain design systems that scale across products and teams.",
    category: "design-systems",
    readTime: 11,
    relatedTools: ["design-system-generator"],
    relatedArticles: ["component-libraries", "design-tokens"],
    publishedAt: "2024-02-05",
    content: `A design system is more than a style guide—it's a single source of truth that brings together principles, guidelines, and reusable components to help teams build consistent products faster.

## What is a Design System?

A design system typically includes:

**Design Principles**: The core beliefs and values that guide design decisions. These answer "why" questions.

**Design Tokens**: The atomic design decisions like colors, spacing, and typography stored as data.

**Component Library**: Reusable UI components with documentation on when and how to use them.

**Patterns**: Solutions to common design problems, showing how components work together.

**Guidelines**: Rules and best practices for using the system.

**Tools and Resources**: Templates, code snippets, design files, and documentation.

## Why Build a Design System?

**Consistency**: Users get a coherent experience across all products.

**Efficiency**: Designers and developers don't reinvent the wheel for common patterns.

**Scalability**: New products and features can be built faster using existing components.

**Quality**: Accessibility, performance, and usability are built into shared components.

**Communication**: Provides a shared language between designers, developers, and stakeholders.

## Starting with Design Tokens

Design tokens are the atoms of your design system—the basic design decisions:

**Colors**: Primary, secondary, accent, semantic (success, warning, error), neutrals.

**Typography**: Font families, sizes, weights, line heights.

**Spacing**: Base unit (usually 4px or 8px) and scale (4, 8, 12, 16, 24, 32, 48, 64, etc.).

**Shadows**: Depth layers for elevation.

**Borders**: Radius, width, style.

**Breakpoints**: Screen sizes for responsive design.

Store tokens as data (JSON, YAML) that can be consumed by both design tools and code. This ensures perfect consistency.

## Building Your Component Library

Start with the most common, foundational components:

**Atoms**: Buttons, inputs, icons, typography, colors.

**Molecules**: Form fields (label + input + error), cards, list items.

**Organisms**: Navigation bars, forms, data tables, modals.

**Templates**: Page layouts combining organisms.

For each component, document:
- When to use it (and when not to)
- Variations and states (default, hover, active, disabled, error)
- Accessibility requirements
- Usage examples
- Do's and don'ts

## Establishing Design Principles

Good design principles are:

**Meaningful**: They should actually guide decisions, not just sound nice.

**Memorable**: Short, punchy statements that stick in people's minds.

**Unique**: Reflect your brand and product goals, not generic platitudes.

Example principles:
- "Clarity over cleverness"
- "Make it feel fast"
- "Progressive disclosure"
- "Consistency breeds confidence"

## Creating Patterns

Patterns show how components combine to solve specific problems:

**Authentication**: Login, signup, password reset flows.

**Search**: How to display search, results, filters, and empty states.

**Forms**: Field layouts, validation, error handling, submission feedback.

**Data Display**: Tables, charts, cards, lists.

**Navigation**: Global nav, breadcrumbs, tabs, pagination.

Document the problem being solved, show examples, explain the rationale, and provide code/design files.

## Governance and Maintenance

**Ownership**: Assign clear owners for the design system.

**Contribution Process**: Make it easy for team members to propose new components or changes.

**Versioning**: Track changes and maintain backward compatibility where possible.

**Communication**: Share updates, gather feedback, celebrate usage.

**Evolution**: Review and update regularly based on team needs and user research.

## Common Pitfalls

**Too Early**: Building a design system before you understand your product needs leads to unused, wrong components.

**Too Perfect**: Don't aim for perfection. Ship something useful quickly, then iterate.

**Too Rigid**: Systems should guide, not constrain. Allow flexibility for unique cases.

**Poor Documentation**: Without good docs, people won't use the system correctly (or at all).

**No Buy-in**: A design system needs support from leadership and adoption from teams.

## Tools and Technology

**Design Tools**: Figma, Sketch, or Adobe XD for visual design and component libraries.

**Documentation**: Storybook, Zeroheight, or custom sites for component documentation.

**Code**: React, Vue, Web Components, or framework-specific libraries.

**Tokens**: Style Dictionary or Theo to transform design tokens into platform-specific formats.

**Version Control**: Git for tracking changes to both design files and code.

## Measuring Success

Track these metrics to show the value of your design system:

**Adoption Rate**: How many teams/products use the system?

**Component Reuse**: What percentage of UI uses system components vs. custom code?

**Velocity**: How much faster are teams shipping new features?

**Consistency**: Fewer visual inconsistencies across products.

**Developer Satisfaction**: Are teams happy with the system?

## Growing Your System

Start small:
1. Define tokens and basic styles
2. Build 5-10 most-used components
3. Document them well
4. Get a few teams using them
5. Gather feedback
6. Add components as needed
7. Never stop iterating

Remember: A design system is a product that serves other products. It needs a product mindset, user research, and continuous improvement. The goal isn't to build the most comprehensive system—it's to build the most useful one for your team's needs.`
  },
  {
    id: "6",
    slug: "responsive-design-best-practices",
    title: "Responsive Design: Crafting Experiences Across All Devices",
    excerpt: "Master the principles and techniques of responsive design to create seamless experiences on any screen size.",
    category: "ui-ux",
    readTime: 10,
    relatedTools: [],
    relatedArticles: ["mobile-first-design", "breakpoint-strategy"],
    publishedAt: "2024-02-10",
    content: `Responsive design ensures your interface works beautifully on phones, tablets, desktops, and everything in between. It's not optional—it's essential for modern web design.

## Core Principles

**Fluid Grids**: Use relative units (percentages, ems, rems) instead of fixed pixels. Layouts should flex and adapt to different screen sizes.

**Flexible Images**: Images should scale within their containers. Use max-width: 100% to prevent images from overflowing.

**Media Queries**: Apply different styles based on screen size, orientation, or device capabilities.

## Mobile-First Approach

Start with the mobile design, then progressively enhance for larger screens:

**Why Mobile-First?**
- Forces you to prioritize content (you can't fit everything on a small screen)
- Ensures performance on slower mobile connections
- Easier to add features than remove them
- Growing majority of users are mobile

**Implementation**: Write base styles for mobile, then use min-width media queries to add complexity for larger screens.

## Breakpoints

Common breakpoints:
- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px - 1024px
- Large Desktop: 1025px+

But don't blindly follow these. Let your content determine breakpoints. Add a breakpoint when your design starts to break or feel cramped.

## Touch Targets

Buttons and interactive elements must be large enough for fingers:
- Minimum 44×44px for tap targets
- Add extra spacing between nearby tappable elements
- Consider thumb reach on mobile devices

## Content Strategy

**Progressive Disclosure**: Show the most important information first. Use accordions, tabs, or "show more" links for secondary content.

**Conditional Content**: Some content works on desktop but not mobile. It's okay to hide or reformat content based on screen size.

**Readability**: Maintain readable line lengths (50-75 characters) across all screen sizes. Adjust font sizes for optimal reading.

## Navigation Patterns

**Mobile**: Hamburger menus, bottom navigation, or priority+ patterns that show important links and hide others.

**Desktop**: Full horizontal navigation, mega menus, or sidebar navigation.

**Transition**: Plan how navigation transforms between sizes. Consider touch vs. hover interactions.

## Performance

Mobile devices often have slower connections:
- Lazy load images below the fold
- Use responsive images (srcset) to serve appropriately sized images
- Minimize JavaScript and CSS
- Consider using a CDN

## Testing

Test on real devices, not just browser resizing:
- Different screen sizes
- Portrait and landscape orientations
- Touch interactions
- Different browsers and operating systems

Remember: Responsive design is about adapting to your users' context, not just screen size. Consider connection speed, input method, and user goals at different sizes.`
  }
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.category === category)
}

export function getRelatedArticles(articleId: string): Article[] {
  const article = articles.find(a => a.id === articleId)
  if (!article || !article.relatedArticles) return []
  
  return articles.filter(a => article.relatedArticles?.includes(a.slug))
}

