<script setup>
// 根元件：負責全域 Layout（Header + 主內容區）
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<template>
  <!-- 整個 App 的最外層包裝 -->
  <div class="app-wrapper">
    <!-- 頂部導覽列（固定顯示於所有頁面） -->
    <AppHeader />

    <!-- 主內容區：RouterView 會在此渲染對應路由的元件 -->
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* App 整體垂直排列 */
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 主內容區填滿剩餘高度 */
.app-main {
  flex: 1;
  padding: var(--space-lg) var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>
