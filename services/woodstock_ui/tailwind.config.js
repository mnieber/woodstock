module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        delete: 'pulse 1s ease-in-out infinite',
      },
    },
    colors: {
      // Base colors
      black: '#000',
      errorRed: '#ff0000',
      transparent: 'transparent',
      white: '#fff',

      // Primary palette - Blues (for primary actions, links, selections)
      blue: {
        darkest: '#1F2933',
        50: '#eff6ff',   // Very light blue background
        100: '#dbeafe',  // Light blue background for hover states
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        primary: '#3b82f6',
        500: '#3b82f6',  // Primary blue
        600: '#2563eb',  // Darker blue for highlighted states
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },

      // Neutral palette - Grays (for text, borders, backgrounds)
      gray: {
        dark: '#374151',     // For dark text
        medium: '#6b7280',   // For medium text
        text: '#4b5563',     // For body text
        50: '#f9fafb',   // Very light background
        100: '#f3f4f6',  // Light background, hover states
        200: '#e5e7eb',  // Borders, dividers
        300: '#d1d5db',  // Stronger borders
        350: '#9ca3af',
        400: '#9ca3af',  // Placeholder text
        500: '#6b7280',  // Body text
        600: '#4b5563',  // Headings, important text
        700: '#374151',  // Dark text
        800: '#1f2937',  // Very dark text
        900: '#111827',  // Almost black
        950: '#030712',
      },

      // Secondary palette - Indigo (for milestones, secondary actions)
      indigo: {
        50: '#eef2ff',   // Light indigo backgrounds
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',  // Primary indigo
        600: '#4f46e5',  // Darker indigo for accents
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        950: '#1e1b4b',
      },

      // Success/status colors - Green (for sync status, success states)
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',  // Light green for badges
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',  // For icons and checkmarks
        700: '#15803d',
        800: '#166534',  // Darker green for text
        900: '#14532d',
        950: '#052e16',
      },

      // Error states - Red
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },

      // Legacy colors (kept for backwards compatibility)
      pink: {
        50: 'hsl(320, 100%, 19%)',
        100: 'hsl(330, 79%, 56%)',
        200: 'hsl(322, 93%, 27%)',
        300: 'hsl(334, 86%, 67%)',
        400: 'hsl(324, 93%, 33%)',
        500: 'hsl(336, 100%, 77%)',
        600: 'hsl(326, 90%, 39%)',
        700: 'hsl(338, 100%, 86%)',
        800: 'hsl(328, 85%, 46%)',
        900: 'hsl(341, 100%, 95%)',
      },
      teal: {
        primary: 'hsl(160, 51%, 49%)',
      },
      purple: {
        100: 'hsl(250, 100%, 85%)',
        600: 'hsl(250, 100%, 60%)',
        900: 'hsl(250, 100%, 40%)',
      },
    },
  },
  plugins: [],
};
