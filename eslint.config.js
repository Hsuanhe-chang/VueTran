// ESLint 9 flat config：整合 Vue 3 + TypeScript + Prettier 規則
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import configPrettier from 'eslint-config-prettier'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  // 套用 ESLint 官方 JS 推薦規則
  js.configs.recommended,

  // 套用 eslint-plugin-vue 的 Vue 3 推薦規則（含 <script setup lang="ts"> 支援）
  ...pluginVue.configs['flat/recommended'],

  // ─── TypeScript 規則設定（套用於 .ts 與 .vue 檔案）───────────────
  {
    files: ['**/*.{ts,tsx,vue}'],
    plugins: {
      // 掛載 @typescript-eslint 插件
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      // 使用 TypeScript 解析器，讓 ESLint 能理解 TS 語法
      parser: tsParser,
      parserOptions: {
        // 需要 tsconfig.json 才能做型別感知規則（type-checked rules）
        project: './tsconfig.app.json',
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // 套用 TypeScript 推薦規則集（不含型別感知版，效能較佳）
      ...tsPlugin.configs['recommended'].rules,
      // 允許用 any 型別（學習環境初期常見，之後可改為 'warn'）
      '@typescript-eslint/no-explicit-any': 'warn',
      // 允許未使用的變數（學習題目中可能有意保留）
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // ─── 一般 JS/Vue 規則 ─────────────────────────────────────────
  {
    // lint 對象：TypeScript、Vue 與一般 JS 檔案
    files: ['**/*.{js,mjs,ts,vue}'],
    rules: {
      // 允許 console.log（學習環境常用）
      'no-console': 'off',
      // 元件名稱不強制多字組合（練習用元件可單字命名）
      'vue/multi-word-component-names': 'off',
    },
  },

  // 關閉所有與 Prettier 衝突的格式規則（Prettier 負責排版）
  configPrettier,

  {
    // 忽略編譯產出與設定檔
    ignores: ['dist/**', 'dist-ssr/**', '*.config.js'],
  },
]
