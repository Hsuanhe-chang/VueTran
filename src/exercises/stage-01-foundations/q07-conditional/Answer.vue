<script setup lang="ts">
/**
 * Q07 — 參考答案：v-if / v-show 條件渲染
 *
 * Bug 解說：
 *   Bug 1：兩個獨立 v-if，應改為 v-if + v-else
 *          v-if + v-else 是同一個條件的兩個分支，Vue 可以更有效率地處理
 *          用兩個 v-if 時，Vue 會各自獨立評估，稍微浪費資源
 *
 *   Bug 2：v-else-if 和 v-if 不能同時出現在同一個元素上
 *          同一個元素只能有一個條件指令
 *          v-else-if 後面再加 v-if 相當於建立一個新的獨立條件，破壞了 if-else 鏈
 *
 *   Bug 3：頻繁切換的顯示/隱藏應使用 v-show 而非 v-if
 *          v-if 每次切換都會銷毀並重建 DOM，成本較高
 *          v-show 只改變 CSS display 屬性，切換成本極低
 */
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userRole = ref('admin')
const isMenuOpen = ref(false)
</script>

<template>
  <div class="conditional-demo answer">
    <h3>🔀 條件渲染練習（參考答案）</h3>

    <!-- Bug 1 修正：改用 v-if + v-else -->
    <section class="demo-section">
      <h4>登入狀態顯示</h4>
      <p v-if="isLoggedIn">歡迎回來！</p>
      <p v-else>請先登入</p>
      <button class="btn btn-outline" @click="isLoggedIn = !isLoggedIn">切換登入狀態</button>
    </section>

    <!-- Bug 2 修正：移除重複的 v-if，只保留 v-else-if -->
    <section class="demo-section">
      <h4>角色權限顯示</h4>
      <div v-if="userRole === 'admin'">
        <p>🔑 你是管理員</p>
      </div>
      <!-- 修正：移除多餘的 v-if="isLoggedIn"，一個元素只能有一個條件指令 -->
      <div v-else-if="userRole === 'user'">
        <p>👤 你是一般使用者</p>
      </div>
      <div v-else>
        <p>👥 你是訪客</p>
      </div>
    </section>

    <!-- Bug 3 修正：頻繁切換改用 v-show -->
    <section class="demo-section">
      <h4>選單顯示（頻繁切換）</h4>
      <!-- v-show 只改 CSS display，不銷毀 DOM，適合頻繁切換 -->
      <nav v-show="isMenuOpen" class="menu">
        <a href="#">首頁</a>
        <a href="#">關於</a>
        <a href="#">聯絡</a>
      </nav>
      <button class="btn btn-outline" @click="isMenuOpen = !isMenuOpen">
        切換選單（{{ isMenuOpen ? '關閉' : '開啟' }}）
      </button>
    </section>
  </div>
</template>

<style scoped>
.conditional-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); }
.menu { display: flex; gap: var(--space-md); padding: var(--space-sm) var(--space-md); background: var(--color-bg); border-radius: var(--radius-sm); }
</style>
