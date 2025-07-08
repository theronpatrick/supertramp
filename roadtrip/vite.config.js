import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import path from "path";

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      tween: "TWEEN",
      jquery: "jQuery",
    },
  },
  server: {
    port: 4001,
    host: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "static",
    rollupOptions: {
      external: ["TWEEN", "jQuery"],
      output: {
        globals: {
          TWEEN: "TWEEN",
          jQuery: "jQuery",
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
