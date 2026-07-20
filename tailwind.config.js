/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--md-sys-color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--md-sys-color-on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--md-sys-color-primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--md-sys-color-on-primary-container) / <alpha-value>)",
        
        background: "rgb(var(--md-sys-color-background) / <alpha-value>)",
        "on-background": "rgb(var(--md-sys-color-on-background) / <alpha-value>)",
        surface: "rgb(var(--md-sys-color-surface) / <alpha-value>)",
        "on-surface": "rgb(var(--md-sys-color-on-surface) / <alpha-value>)",
        
        "surface-variant": "rgb(var(--md-sys-color-surface-variant) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--md-sys-color-on-surface-variant) / <alpha-value>)",
        
        error: "rgb(var(--md-sys-color-error) / <alpha-value>)",
        "on-error": "rgb(var(--md-sys-color-on-error) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
