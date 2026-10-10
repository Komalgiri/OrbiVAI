/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background Colors
        background: {
          DEFAULT: '#F7F9FC',     // Canvas
          surface: '#FFFFFF',     // Surface
          border: '#E4E9F0',      // Border
        },
        // Primary Action
        primary: {
          DEFAULT: '#315EFB',     // Primary
          dark: '#234BD9',        // Darker shade for hover states
        },
        // AI Feature Gradient (used in components with bg-gradient-to-r from-ai-start to-ai-end)
        ai: {
          start: '#8A63D2',       // Purple
          end: '#569AFF',         // Indigo
        },
        // Status Colors
        success: '#238636',       // GitHub Green
        warning: '#D29922',       // Warning/Urgent
        // Text Colors
        text: {
          primary: '#182230',     // Primary Text
          secondary: '#4A5568',   // Secondary Text
        },
      },
      // Custom Gradients
      backgroundImage: {
        'ai-gradient': 'linear-gradient(90deg, #8A63D2 0%, #569AFF 100%)',
      },
      // Box Shadow
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class strategy for better control
    }),
  ],
  darkMode: 'class', // Using class-based dark mode
}