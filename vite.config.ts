import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
export default defineConfig({
  plugins: [react(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 6767,
    proxy: {
      "/api": {
        target: process.env.VITE_APP_BASE_URL || "",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    },
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 6767,
    proxy: {
      "/api": {
        target: process.env.VITE_APP_BASE_URL || "",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
