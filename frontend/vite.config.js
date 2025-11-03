import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-map-gl": "react-map-gl/dist/esm/index.js",
      "@": path.resolve(__dirname, "./src"), // @ sẽ trỏ thẳng tới folder src
      "@business": path.resolve(__dirname, "./src/features/business"),
      "@traveler": path.resolve(__dirname, "./src/features/traveler"),
      "@admin": path.resolve(__dirname, "./src/features/admin"),
    },
  },
});
