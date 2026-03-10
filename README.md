This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Theme System

This project features a comprehensive dark/light theme system with automatic system preference detection and smooth transitions.

### Features

- **Dark and Light Themes**: Full support for both themes across all pages
- **System Preference Detection**: Automatically detects and follows your system's theme preference
- **Manual Override**: Users can manually select their preferred theme
- **Persistent Selection**: Theme choice is saved to localStorage and persists across sessions
- **Smooth Transitions**: CSS transitions provide smooth theme switching animations
- **Flash Prevention**: Initial theme is applied before React hydration to prevent flash of wrong theme
- **Mobile Support**: Fully responsive and works on all device sizes

### Usage

#### Toggle Theme

The theme toggle button is integrated into the navbar. Users can click the sun/moon icon to switch between light and dark modes.

#### Using ThemeContext in Components

To access or modify the theme in your components:

```tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

**Important**: Components using `useTheme` must have the `'use client'` directive at the top of the file, as ThemeContext is a client-side context.

#### ThemeProvider Setup

The ThemeProvider is already configured in `src/app/layout.tsx` and wraps the entire application:

```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### CSS Variables

Theme colors are defined using CSS custom properties in `src/styles/globals.css`:

**Light Theme (default)**:
- `--color-cream`: Main background color
- `--color-espresso`: Primary text color
- `--color-tan`, `--color-leather`, `--color-brown`: Accent colors
- `--color-gold`: Highlight color

**Dark Theme**:
- All colors are inverted and adjusted for dark mode visibility
- Maintains WCAG AA contrast ratios (4.5:1 minimum)

To use theme colors in your styles:

```css
.my-component {
  background-color: var(--color-cream);
  color: var(--color-espresso);
}

/* Automatically switches to dark theme colors when [data-theme="dark"] */
```

Or with Tailwind CSS:

```tsx
<div className="bg-cream text-espresso">
  {/* Colors automatically adapt to theme */}
</div>
```

### Testing Theme Components

When testing components that use the theme system:

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

test('my component with theme', () => {
  render(
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  );
});
```

### Architecture

- **ThemeContext** (`src/contexts/ThemeContext.tsx`): Global theme state management
- **ThemeToggle** (`src/components/ui/ThemeToggle.tsx`): Theme toggle button component
- **CSS Variables** (`src/styles/globals.css`): Theme color definitions
- **Flash Prevention**: Inline script in `src/app/layout.tsx` prevents flash on initial load

### Accessibility

- Theme toggle is fully keyboard accessible (Enter and Space keys)
- Includes appropriate ARIA labels
- Focus indicators visible in both themes
- Maintains sufficient color contrast in both themes (WCAG AA compliant)
