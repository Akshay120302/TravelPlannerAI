/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(161, 95, 250, 1)' },  // Full brightness
          '50%': { borderColor: 'rgba(176, 119, 252, 0.3)' },  // Dimmed color
        },
      },
      animation: {
        borderGlow: 'borderGlow 3s ease-in-out infinite', // 3-second animation for border glow
      },
    },
  },
  darkMode: 'class', // Enable class-based dark mode
  plugins: [],
}

// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         glow: {
//           '0%, 100%': { filter: 'brightness(1)' },
//           '50%': { filter: 'brightness(1.5)' },  // Glow at its brightest
//         },
//       },
//       animation: {
//         glow: 'glow 3s ease-in-out infinite', // 3-second glow animation
//       },
//     },
//   },
//   plugins: [],
// };