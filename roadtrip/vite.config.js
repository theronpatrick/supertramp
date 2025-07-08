import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import path from "path";

export default defineConfig({
  base: "/roadtrip/",
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
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      external: ["TWEEN", "jQuery"],
      output: {
        globals: {
          TWEEN: "TWEEN",
          jQuery: "jQuery",
        },
        entryFileNames: "static/js/app.[hash].js",
        chunkFileNames: "static/js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `static/css/app.[hash].${ext}`;
          }
          return `static/[ext]/[name].[hash].[ext]`;
        },
        manualChunks: {
          vendor: ["vue", "vue-router", "@tweenjs/tween.js"],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
