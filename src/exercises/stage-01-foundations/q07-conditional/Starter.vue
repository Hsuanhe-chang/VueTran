<script setup>
/** Q07 — v-if / v-show 條件渲染（找錯誤題） */
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userRole = ref('admin')  // 'admin' | 'user' | 'guest'
const isMenuOpen = ref(false)
</script>

<template>
  <div class="conditional-demo">
    <h3>🔀 條件渲染練習（找出 3 個 Bug）</h3>

    <!-- Bug 1：以下用法有什麼問題？ -->
    <section class="demo-section">
      <h4>登入狀態顯示</h4>
      <!-- 🐛 Bug 1 在這裡 -->
      <p v-if="isLoggedIn">歡迎回來！</p>
      <p v-if="!isLoggedIn">請先登入</p>
      <!-- 提示：這樣寫功能上沒問題，但有更好的寫法 -->
      <!-- 問題：當 isLoggedIn 改變時，Vue 要處理兩個獨立的 v-if，效能較差 -->
      <!-- 正確做法應該使用 v-if + v-else -->
      <button class="btn btn-outline" @click="isLoggedIn = !isLoggedIn">
        切換登入狀態
      </button>
    </section>

    <!-- Bug 2 -->
    <section class="demo-section">
      <h4>角色權限顯示</h4>
      <!-- 🐛 Bug 2 在這裡：v-else-if 的語法問題 -->
      <div v-if="userRole === 'admin'">
        <p>🔑 你是管理員</p>
      </div>
      <!-- 以下這行有 bug！ -->
      <div v-else-if="userRole === 'user'" v-if="isLoggedIn">
        <p>👤 你是一般使用者</p>
      </div>
      <div v-else>
        <p>👥 你是訪客</p>
      </div>
    </section>

    <!-- Bug 3 -->
    <section class="demo-section">
      <h4>選單顯示（頻繁切換）</h4>
      <!-- 🐛 Bug 3：這裡選用了錯誤的指令 -->
      <!-- 選單需要「頻繁切換」顯示/隱藏，應該用哪個指令？ -->
      <nav v-if="isMenuOpen" class="menu">
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
.conditional-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); }
.menu { display: flex; gap: var(--space-md); padding: var(--space-sm) var(--space-md); background: var(--color-bg); border-radius: var(--radius-sm); }
</style>
