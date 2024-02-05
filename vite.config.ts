import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
  server: {
    port: 8000,
  },
});
