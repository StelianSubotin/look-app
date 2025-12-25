import { hexToHSL, hslToHex } from "./palette-generator"

interface DesignSystem {
  brand: {
    name: string
    industry: string
    description: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string[]
    success: string
    warning: string
    error: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    scale: number[]
  }
  spacing: {
    base: number
    scale: number[]
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

/**
 * Generate color shades for Tailwind
 */
export function generateColorShades(hexColor: string) {
  const hsl = hexToHSL(hexColor)
  
  return {
    50: hslToHex(hsl.h, Math.max(hsl.s - 10, 10), 95),
    100: hslToHex(hsl.h, Math.max(hsl.s - 5, 20), 90),
    200: hslToHex(hsl.h, hsl.s, 80),
    300: hslToHex(hsl.h, hsl.s, 70),
    400: hslToHex(hsl.h, hsl.s, 60),
    500: hexColor, // Base color
    600: hslToHex(hsl.h, hsl.s, 45),
    700: hslToHex(hsl.h, hsl.s, 35),
    800: hslToHex(hsl.h, hsl.s, 25),
    900: hslToHex(hsl.h, hsl.s, 15),
  }
}

/**
 * Convert hex to shadcn HSL format (hue saturation lightness)
 */
export function toShadcnHSL(hexColor: string): string {
  const hsl = hexToHSL(hexColor)
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

/**
 * Generate Tailwind config
 */
export function generateTailwindConfig(designSystem: DesignSystem): string {
  const primaryShades = generateColorShades(designSystem.colors.primary)
  const secondaryShades = generateColorShades(designSystem.colors.secondary)
  const accentShades = generateColorShades(designSystem.colors.accent)
  
  const formatShades = (shades: Record<string, string>) => {
    return Object.entries(shades)
      .map(([shade, color]) => `          ${shade}: '${color}',`)
      .join('\n')
  }

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
${formatShades(primaryShades)}
        },
        secondary: {
${formatShades(secondaryShades)}
        },
        accent: {
${formatShades(accentShades)}
        },
        success: '${designSystem.colors.success}',
        warning: '${designSystem.colors.warning}',
        error: '${designSystem.colors.error}',
      },
      fontFamily: {
        heading: ['${designSystem.typography.headingFont}', 'sans-serif'],
        body: ['${designSystem.typography.bodyFont}', 'sans-serif'],
      },
      fontSize: {
${designSystem.typography.scale.map((size, i) => `        '${['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'][i] || `size-${i}`}': '${size}px',`).join('\n')}
      },
      spacing: {
${designSystem.spacing.scale.map(val => `        '${val}': '${val}px',`).join('\n')}
      },
      borderRadius: {
        sm: '${designSystem.borderRadius.sm}',
        DEFAULT: '${designSystem.borderRadius.md}',
        md: '${designSystem.borderRadius.md}',
        lg: '${designSystem.borderRadius.lg}',
        xl: '${designSystem.borderRadius.xl}',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}`
}

/**
 * Generate shadcn/ui CSS variables
 */
export function generateShadcnCSS(designSystem: DesignSystem): string {
  return `@layer base {
  :root {
    /* Brand Colors */
    --primary: ${toShadcnHSL(designSystem.colors.primary)};
    --primary-foreground: 210 40% 98%;
    --secondary: ${toShadcnHSL(designSystem.colors.secondary)};
    --secondary-foreground: 222.2 47.4% 11.2%;
    --accent: ${toShadcnHSL(designSystem.colors.accent)};
    --accent-foreground: 222.2 47.4% 11.2%;
    
    /* Neutrals */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --muted: ${toShadcnHSL(designSystem.colors.neutral[1])};
    --muted-foreground: ${toShadcnHSL(designSystem.colors.neutral[4])};
    --border: ${toShadcnHSL(designSystem.colors.neutral[2])};
    --input: ${toShadcnHSL(designSystem.colors.neutral[2])};
    --ring: ${toShadcnHSL(designSystem.colors.primary)};
    
    /* Semantic Colors */
    --success: ${toShadcnHSL(designSystem.colors.success)};
    --warning: ${toShadcnHSL(designSystem.colors.warning)};
    --destructive: ${toShadcnHSL(designSystem.colors.error)};
    --destructive-foreground: 210 40% 98%;
    
    /* Border Radius */
    --radius: ${designSystem.borderRadius.md};
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: ${toShadcnHSL(designSystem.colors.primary)};
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: ${toShadcnHSL(designSystem.colors.primary)};
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: ${designSystem.typography.bodyFont}, sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${designSystem.typography.headingFont}, sans-serif;
  }
}`
}

/**
 * Generate Design Tokens JSON
 */
export function generateDesignTokens(designSystem: DesignSystem): string {
  const tokens = {
    color: {
      primary: {
        value: designSystem.colors.primary,
        type: "color"
      },
      secondary: {
        value: designSystem.colors.secondary,
        type: "color"
      },
      accent: {
        value: designSystem.colors.accent,
        type: "color"
      },
      success: {
        value: designSystem.colors.success,
        type: "color"
      },
      warning: {
        value: designSystem.colors.warning,
        type: "color"
      },
      error: {
        value: designSystem.colors.error,
        type: "color"
      },
      neutral: designSystem.colors.neutral.reduce((acc, color, i) => ({
        ...acc,
        [`${i + 1}`]: { value: color, type: "color" }
      }), {})
    },
    font: {
      heading: {
        value: designSystem.typography.headingFont,
        type: "fontFamily"
      },
      body: {
        value: designSystem.typography.bodyFont,
        type: "fontFamily"
      }
    },
    fontSize: designSystem.typography.scale.reduce((acc, size, i) => ({
      ...acc,
      [`size-${i + 1}`]: { value: `${size}px`, type: "fontSize" }
    }), {}),
    spacing: {
      base: {
        value: `${designSystem.spacing.base}px`,
        type: "spacing"
      },
      scale: designSystem.spacing.scale.reduce((acc, val, i) => ({
        ...acc,
        [`${i + 1}`]: { value: `${val}px`, type: "spacing" }
      }), {})
    },
    borderRadius: {
      sm: { value: designSystem.borderRadius.sm, type: "borderRadius" },
      md: { value: designSystem.borderRadius.md, type: "borderRadius" },
      lg: { value: designSystem.borderRadius.lg, type: "borderRadius" },
      xl: { value: designSystem.borderRadius.xl, type: "borderRadius" }
    }
  }

  return JSON.stringify(tokens, null, 2)
}

/**
 * Generate React Theme object
 */
export function generateReactTheme(designSystem: DesignSystem): string {
  return `export const theme = {
  colors: {
    primary: '${designSystem.colors.primary}',
    secondary: '${designSystem.colors.secondary}',
    accent: '${designSystem.colors.accent}',
    success: '${designSystem.colors.success}',
    warning: '${designSystem.colors.warning}',
    error: '${designSystem.colors.error}',
    neutral: [
${designSystem.colors.neutral.map(c => `      '${c}',`).join('\n')}
    ]
  },
  typography: {
    fontFamily: {
      heading: '${designSystem.typography.headingFont}, sans-serif',
      body: '${designSystem.typography.bodyFont}, sans-serif'
    },
    fontSize: [
${designSystem.typography.scale.map(s => `      ${s},`).join('\n')}
    ]
  },
  spacing: [
${designSystem.spacing.scale.map(s => `    ${s},`).join('\n')}
  ],
  borderRadius: {
    sm: '${designSystem.borderRadius.sm}',
    md: '${designSystem.borderRadius.md}',
    lg: '${designSystem.borderRadius.lg}',
    xl: '${designSystem.borderRadius.xl}'
  }
} as const

export type Theme = typeof theme`
}

/**
 * Generate installation instructions
 */
export function generateInstructions(format: string, brandName: string): string {
  const instructions: Record<string, string> = {
    tailwind: `# Install ${brandName} Design System (Tailwind)

## Step 1: Install Dependencies
\`\`\`bash
npm install -D tailwindcss tailwindcss-animate
\`\`\`

## Step 2: Update tailwind.config.js
Copy the config from the "Tailwind Config" tab and replace your existing \`tailwind.config.js\`

## Step 3: Import in your CSS
\`\`\`css
@tailwind base;
@tailwind components;
@tailwind utilities;
\`\`\`

## Step 4: Start Using
Your brand colors are now available:
- \`bg-primary-500\` - Primary color
- \`text-secondary-600\` - Secondary text
- \`border-accent-300\` - Accent border
- All shades from 50-900 available!

Example:
\`\`\`jsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg">
  Click Me
</button>
\`\`\``,

    shadcn: `# Install ${brandName} Design System (shadcn/ui)

## Step 1: Setup shadcn/ui
\`\`\`bash
npx shadcn-ui@latest init
\`\`\`

## Step 2: Add CSS Variables
Copy the CSS from the "shadcn/ui CSS" tab and add to your \`globals.css\`:

## Step 3: Use Components
\`\`\`bash
npx shadcn-ui@latest add button
\`\`\`

## Step 4: Components Auto-Styled!
All shadcn components now use your brand colors:
\`\`\`jsx
import { Button } from "@/components/ui/button"

<Button>Automatically styled with your brand!</Button>
\`\`\``,

    tokens: `# Using Design Tokens (${brandName})

## Step 1: Save tokens.json
Copy the JSON from the "Design Tokens" tab and save as \`tokens.json\`

## Step 2: Install Style Dictionary (Optional)
\`\`\`bash
npm install -D style-dictionary
\`\`\`

## Step 3: Transform for Your Platform
Use Style Dictionary to convert tokens to:
- CSS variables
- SCSS variables  
- iOS/Android native formats
- And more!

## Direct Usage
Import and use directly in JavaScript:
\`\`\`js
import tokens from './tokens.json'

const primaryColor = tokens.color.primary.value
\`\`\``,

    react: `# Install ${brandName} Theme (React)

## Step 1: Create theme.ts
Copy the code from the "React Theme" tab and save as \`theme.ts\`

## Step 2: Create ThemeProvider
\`\`\`tsx
import { createContext, useContext } from 'react'
import { theme } from './theme'

const ThemeContext = createContext(theme)

export const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
)

export const useTheme = () => useContext(ThemeContext)
\`\`\`

## Step 3: Use in Components
\`\`\`tsx
import { useTheme } from './ThemeProvider'

const MyComponent = () => {
  const theme = useTheme()
  
  return (
    <div style={{ 
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.body 
    }}>
      Styled with your theme!
    </div>
  )
}
\`\`\``
  }

  return instructions[format] || ''
}

/**
 * Generate package.json dependencies
 */
export function getRequiredDependencies(format: string): string {
  const dependencies: Record<string, object> = {
    tailwind: {
      "devDependencies": {
        "tailwindcss": "^3.4.0",
        "tailwindcss-animate": "^1.0.7",
        "autoprefixer": "^10.4.16",
        "postcss": "^8.4.32"
      }
    },
    shadcn: {
      "dependencies": {
        "@radix-ui/react-slot": "^1.0.2",
        "class-variance-authority": "^0.7.0",
        "clsx": "^2.0.0",
        "tailwind-merge": "^2.2.0"
      },
      "devDependencies": {
        "tailwindcss": "^3.4.0",
        "tailwindcss-animate": "^1.0.7"
      }
    },
    tokens: {
      "devDependencies": {
        "style-dictionary": "^3.9.0"
      }
    },
    react: {}
  }

  return JSON.stringify(dependencies[format] || {}, null, 2)
}

