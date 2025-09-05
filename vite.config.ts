// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  plugins: [vue(), cssInjectedByJsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Вместо обычной «app»‑сборки используем библиотечный режим:
    lib: {
      // Точка входа — ваш main.ts (там, где вы делаете createApp(WidjetChat)...)
      entry: path.resolve(__dirname, "src/main.ts"),
      // Глобальное имя (если собираем в UMD/iife, но нам подойдет es)
      name: "ChatRexWidget",
      // Как назвать выходной файл (без расширения — Vite добавит .js)
      fileName: "chatrex-widget",
    },
    // Опции Rollup: единый чанк + отключаем разбиение
    rollupOptions: {
      output: {
        entryFileNames: "chatrex-widget.js",
      },
    },
    // Отключаем генерацию дополнительных sourcemap‑файлов
    sourcemap: false,
    cssCodeSplit: false,
  },
});
