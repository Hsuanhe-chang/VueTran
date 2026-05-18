// ESLint 9 flat config：整合 Vue 3 + Prettier 規則
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'

export default [
  // 套用 ESLint 官方 JS 推薦規則
  js.configs.recommended,

  // 套用 eslint-plugin-vue 的 Vue 3 推薦規則（含 <script setup> 支援）
  ...pluginVue.configs['flat/recommended'],

  // 關閉所有與 Prettier 衝突的格式規則（Prettier 負責排版）
  configPrettier,

  {
    // 只 lint JS 與 Vue 檔案
    files: ['**/*.{js,mjs,vue}'],
    rules: {
      // 允許 console.log（學習環境常用）
      'no-console': 'off',
      // 元件名稱強制多字組成（避免與 HTML 原生標籤衝突）
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    // 忽略編譯產出與設定檔
    ignores: ['dist/**', 'dist-ssr/**', '*.config.js'],
  },
]
