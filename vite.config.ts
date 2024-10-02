import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';


export default defineConfig({
  plugins: [react(), babel(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
