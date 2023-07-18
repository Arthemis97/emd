/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  important: true,
  content: ["./resources/js/**/*.{vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}

