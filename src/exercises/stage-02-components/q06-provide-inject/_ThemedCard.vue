<script setup lang="ts">
/** _ThemedCard.vue — 已提供的子元件（不需修改）
 *  透過 inject 取得父層提供的 theme 和 toggleTheme。
 *  當父層正確呼叫 provide() 後，這個元件的外觀會跟著主題變化。
 */
import { inject } from 'vue'

// 從父層注入主題 ref（key 必須與父層 provide 的 key 一致）
// 第二個參數是預設值：若父層沒有 provide，使用此預設
const theme       = inject('theme', { value: 'light' })
const toggleTheme = inject('toggleTheme', null)
</script>

<template>
  <div :class="['themed-card', `theme-${theme}`]">
    <div class="card-content">
      <p class="theme-label">目前主題：<strong>{{ theme }}</strong></p>
      <p class="inject-label">（此值來自父層的 provide('theme', ...)）</p>
    </div>

    <!-- 如果父層有提供 toggleTheme 函式，顯示切換按鈕 -->
    <button
      v-if="toggleTheme"
      class="btn btn-outline toggle-btn"
      @click="toggleTheme"
    >
      🌓 切換主題
    </button>
    <p v-else class="no-provider">
      ⚠️ 未偵測到父層的 provide，請完成 TODO
    </p>
  </div>
</template>

<style scoped>
.themed-card { border: 2px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md); transition: background 0.3s, color 0.3s; display: flex; flex-direction: column; gap: var(--space-sm); }
.theme-light { background: #f8fafc; color: #1e293b; border-color: #e2e8f0; }
.theme-dark  { background: #1e293b; color: #f1f5f9; border-color: #475569; }
.card-content { display: flex; flex-direction: column; gap: 4px; }
.theme-label { font-weight: 600; font-size: var(--font-size-lg); }
.inject-label { font-size: var(--font-size-sm); opacity: 0.6; }
.toggle-btn { align-self: flex-start; }
.no-provider { color: #f59e0b; font-size: var(--font-size-sm); }
</style>
