import type { Config } from 'tailwindcss'
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        jelly: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12" },
        bubble: { 100:"#e0f2fe",300:"#7dd3fc",500:"#0ea5e9",700:"#0369a1" },
        slime: { 100:"#dcfce7",300:"#86efac",500:"#22c55e",700:"#15803d" }
      },
      boxShadow: { squish: '0 10px 0 0 rgba(0,0,0,0.1)' },
      borderRadius: { puffy: '1.5rem' }
    }
  },
  plugins: []
} satisfies Config
