// Vite 設定檔（TypeScript 版）：定義 Vue 插件與路徑別名
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    // 讓 Vite 能理解並編譯 .vue 單檔案元件
    vue(),
  ],

  resolve: {
    alias: {
      // 將 @ 對應到 src 目錄，方便 import 時不用寫相對路徑
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    // 開發伺服器預設埠號
    port: 5173,
  },
})
