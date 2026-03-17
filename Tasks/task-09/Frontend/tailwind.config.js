/** @type {import('tailwindcss').Config} */
export default {
  // Define files that Tailwind should scan for class names
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom typography configuration
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        arial: ['Arial', 'sans-serif'],
      },
      // Extend background images
      backgroundImage: {
        'main-bg': "url('../BG.jpeg')",
      },
      // Custom color palette
      colors: {
  surface: {
    100: '#f1f5f9', 
    800: '#1e293b',
    850: '#111118',
    900: '#0a0a0f',
    950: '#050508',
  },
        brand: {
          cyan: '#00d2ff',
          500: '#00d2ff',
          600: '#00aed9',
          maroon: '#8c2d3d', // Added from your CSS
        },
      },
      // Custom shadows and shapes
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
        'glow': '0 0 20px rgba(0, 210, 255, 0.2)',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        // Glassmorphism component style
        '.glass-card': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 210, 255, 0.15)',
          borderRadius: '1.2rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#00d2ff',
            backgroundColor: 'rgba(0, 210, 255, 0.08)',
          },
        },
        // Custom form input style from your CSS
        '.form-input': {
          width: '100%',
          padding: '12px 15px',
          marginBottom: '15px',
          background: 'transparent',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          color: '#ffffff',
          fontSize: '14px',
          '&::placeholder': { color: 'rgba(255, 255, 255, 0.7)' },
          '&:focus': { outline: 'none', borderColor: '#00d2ff' }
        },
        // Custom button style for submission
        '.btn-submit': {
          width: '100%',
          padding: '15px',
          marginTop: '30px',
          background: '#ffffff',
          border: 'none',
          fontSize: '18px',
          fontWeight: '600',
          color: '#333333',
          cursor: 'pointer',
          textAlign: 'center',
          transition: '0.3s',
          '&:hover': { opacity: '0.9' }
        },
        // Active state for selected task
        '.project-active': {
          borderColor: '#00d2ff !important',
          backgroundColor: 'rgba(0, 210, 255, 0.12) !important',
          boxShadow: '0 0 20px rgba(0, 210, 255, 0.2)',
        },
        // Calculator specific buttons
        '.calc-btn': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          fontWeight: '600',
          transition: 'all 0.1s ease',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderColor: '#00d2ff' },
          '&:active': { backgroundColor: '#ffffff !important', color: '#000000 !important', transform: 'scale(0.95)' },
        },
        // Equal button style
        '.equal-btn': {
          backgroundColor: '#00d2ff',
          color: '#000000',
          fontWeight: 'bold',
          '&:active': { backgroundColor: '#ffffff !important', color: '#000000 !important' },
        }
      });
    }
  ],
}