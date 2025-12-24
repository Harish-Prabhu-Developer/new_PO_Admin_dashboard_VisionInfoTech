import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",   // Listen on all network interfaces
    port: 5173,        // Preferred starting port
    strictPort: false, // Allow Vite to use the next available port
  },
});
