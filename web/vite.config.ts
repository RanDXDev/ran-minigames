import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: "./",
  build: {
    outDir: "../html",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "js/index.js",
        chunkFileNames: "js/index.js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      $lib: resolve(__dirname, "src/lib"),
      $components: resolve(__dirname, "src/lib/components"),
      $utils: resolve(__dirname, "src/lib/utils"),
      $store: resolve(__dirname, "src/lib/store"),
    },
  },
});
