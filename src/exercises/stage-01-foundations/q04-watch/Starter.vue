<script setup>
/**
 * Q04 — watch 與 watchEffect
 * Part A（找錯誤）：找出 3 個 bug
 * Part B（從零撰寫）：建立帶 debounce 的搜尋框
 */
import { ref, reactive, watch, watchEffect } from 'vue'

// ─── Part A：找錯誤區 ────────────────────────────────────
// 以下 watch 用法有 3 個 bug，找出並在下方說明

const bugCount = ref(0)
const bugUser = reactive({ name: 'Alice' })  // 🐛 哪裡有問題？

// Bug 1
watch(bugCount.value, (newVal) => {     // 🐛 監聽來源寫法有問題
  console.log('count changed:', newVal)
})

// Bug 2
watch(bugUser, (newVal) => {            // 🐛 監聽物件的問題
  console.log('user changed:', newVal)
})

// Bug 3
const stopWatch = watchEffect(() => {   // 這段本身沒有 bug
  console.log('count is:', bugCount.value)
})
stopWatch()                             // 🐛 這樣做有什麼問題？

// ─── Part B：從零撰寫區 ──────────────────────────────────
// TODO: 建立搜尋框的響應式狀態
const searchQuery = ref('')
const searchStatus = ref('')       // 顯示「正在搜尋：xxx」
const lengthWarning = ref(false)   // 長度 > 10 時為 true

// TODO: 用 watch 監聽 searchQuery
//       加入 300ms debounce（用 setTimeout / clearTimeout 實作）
//       在 callback 中更新 searchStatus
let debounceTimer = null

watch(/* TODO */)

// TODO: 用 watchEffect 監聽 searchQuery 長度
//       當 searchQuery.value.length > 10 時，設 lengthWarning = true
watchEffect(/* TODO */)
</script>

<template>
  <div class="watch-demo">
    <h3>👁️ watch 與 watchEffect 練習</h3>

    <!-- Part A：Bug 說明區 -->
    <section class="bug-section card">
      <h4>Part A — 找到這 3 個 Bug 了嗎？</h4>
      <ol>
        <li>Bug 1（第 15 行）：監聽來源寫法的問題</li>
        <li>Bug 2（第 20 行）：監聽物件時需要的選項</li>
        <li>Bug 3（第 28 行）：立即呼叫 stopWatch() 的問題</li>
      </ol>
    </section>

    <!-- Part B：搜尋框 -->
    <section class="search-section card">
      <h4>Part B — 帶 Debounce 的搜尋框</h4>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="輸入搜尋關鍵字..."
        class="search-input"
      />

      <!-- 搜尋狀態提示 -->
      <p v-if="searchStatus" class="search-status">🔍 {{ searchStatus }}</p>

      <!-- 長度警告 -->
      <p v-if="lengthWarning" class="length-warning">⚠️ 搜尋關鍵字過長（超過 10 個字元）</p>
    </section>
  </div>
</template>

<style scoped>
.watch-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h4 { margin-bottom: var(--space-md); color: var(--color-secondary); }
.bug-section ol { padding-left: var(--space-lg); line-height: 2.2; color: var(--color-text-muted); }
.search-section { display: flex; flex-direction: column; gap: var(--space-md); }
.search-input { padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); width: 100%; }
.search-input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(66,184,131,0.15); }
.search-status { color: var(--color-primary); font-weight: 500; }
.length-warning { color: #ef4444; font-weight: 500; }
</style>
