<script setup>
// 全域頂部導覽列：顯示品牌名稱與首頁連結
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- 品牌 Logo 與標題（點擊回首頁） -->
      <RouterLink to="/" class="brand">
        <span class="brand-icon">🟢</span>
        <span class="brand-name">Vue 3 學習考題系統</span>
      </RouterLink>

      <!-- 右側說明文字 -->
      <span class="header-tagline">Composition API · Vite · Pinia · Router</span>
    </div>
  </header>
</template>

<style scoped>
/* 固定在頂部的導覽列 */
.app-header {
  background: var(--color-secondary);
  color: white;
  padding: 0 var(--space-xl);
  box-shadow: var(--shadow-md);
}

/* 內容水平排列、垂直置中 */
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 品牌連結 */
.brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: var(--font-size-lg);
  transition: opacity var(--transition-fast);
}

.brand:hover {
  opacity: 0.85;
  text-decoration: none;
  color: white;
}

/* 右側副標題 */
.header-tagline {
  font-size: var(--font-size-sm);
  opacity: 0.65;
  letter-spacing: 0.02em;
}
</style>
