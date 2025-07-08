import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  base: "/bison/",
  plugins: [preact()],
  build: {
    outDir: "../../docs/bison",
    emptyOutDir: true,
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
      output: {
        entryFileNames: "assets/index.[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/index.[hash].${ext}`;
          }
          return `assets/[name].[hash].[ext]`;
        },
        manualChunks: {
          vendor: ["preact"],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
