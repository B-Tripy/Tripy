import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.45.25:5000",
        // target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
