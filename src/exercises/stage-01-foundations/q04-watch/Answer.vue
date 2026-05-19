<script setup lang="ts">
/**
 * Q04 — 參考答案：watch 與 watchEffect
 *
 * Bug 解說：
 *   Bug 1：watch(bugCount.value, ...) — 應該傳入 ref 本身，不是 .value
 *          watch(bugCount, ...)  ← 正確
 *          傳入 .value 後得到的是普通 number，失去響應性
 *
 *   Bug 2：watch(bugUser, ...) — 監聽 reactive 物件的「內部屬性」變化
 *          需要加 { deep: true } 才能偵測到物件內部屬性的修改
 *          watch(bugUser, ..., { deep: true })  ← 正確
 *
 *   Bug 3：立即呼叫 stopWatch() — watchEffect 一建立就執行一次
 *          但緊接著 stopWatch() 會立即停止監聽
 *          初始執行完就永遠不再監聽，相當於沒用
 */
import { ref, reactive, watch, watchEffect } from 'vue'

// Part B：搜尋框實作
const searchQuery = ref('')
const searchStatus = ref('')
const lengthWarning = ref(false)

// debounce timer 存放在普通 let（不需要響應式）
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// watch 監聽 searchQuery 的變化
// 加 { immediate: false } 是預設值，也可不寫（懶執行）
watch(searchQuery, (newVal) => {
  // 清除之前的 timer（這是 debounce 的核心邏輯）
  // ?? undefined 用於解決 clearTimeout 不接受 null 的 TS 型別問題
  clearTimeout(debounceTimer ?? undefined)

  // 若輸入框被清空，清除搜尋狀態
  if (!newVal.trim()) {
    searchStatus.value = ''
    return
  }

  // 300ms 後才真正執行，若在這段時間內又輸入，timer 會被清除重新計時
  debounceTimer = setTimeout(() => {
    searchStatus.value = `正在搜尋：${newVal}`
  }, 300)
})

// watchEffect 自動收集所有用到的響應式資料（這裡是 searchQuery）
// 初始就會執行一次，不需要 immediate: true
watchEffect(() => {
  // 當 searchQuery.value.length 改變時自動觸發
  lengthWarning.value = searchQuery.value.length > 10
})
</script>

<template>
  <div class="watch-demo answer">
    <h3>👁️ watch 與 watchEffect 練習（參考答案）</h3>

    <!-- Bug 解說 -->
    <section class="bug-section card">
      <h4>Part A — Bug 解說</h4>
      <dl class="bug-list">
        <dt>Bug 1：<code>watch(bugCount.value, ...)</code></dt>
        <dd>傳入 <code>.value</code> 後是普通 number，失去響應性。<br />正確：<code>watch(bugCount, ...)</code></dd>
        <dt>Bug 2：<code>watch(bugUser, ...)</code>（缺 deep 選項）</dt>
        <dd>監聽 reactive 物件的內部屬性變化需要 <code>&#123; deep: true &#125;</code>。<br />正確：<code>watch(bugUser, ..., &#123; deep: true &#125;)</code></dd>
        <dt>Bug 3：<code>stopWatch()</code> 立即呼叫</dt>
        <dd>建立後馬上停止 → 初始執行完就永遠不監聽了。<br />正確做法：在需要清除時再呼叫（例如 onUnmounted）。</dd>
      </dl>
    </section>

    <!-- 搜尋框 -->
    <section class="search-section card">
      <h4>Part B — 帶 Debounce 的搜尋框</h4>
      <input v-model="searchQuery" type="text" placeholder="輸入搜尋關鍵字..." class="search-input" />
      <p v-if="searchStatus" class="search-status">🔍 {{ searchStatus }}</p>
      <p v-if="lengthWarning" class="length-warning">⚠️ 搜尋關鍵字過長（超過 10 個字元）</p>
    </section>
  </div>
</template>

<style scoped>
.watch-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
h4 { margin-bottom: var(--space-md); color: var(--color-secondary); }
.bug-list { display: flex; flex-direction: column; gap: var(--space-md); }
dt { font-family: var(--font-mono); font-weight: 600; margin-bottom: 4px; color: #ef4444; }
dd { padding-left: var(--space-md); color: var(--color-text-muted); line-height: 1.8; }
.search-section { display: flex; flex-direction: column; gap: var(--space-md); }
.search-input { padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-base); width: 100%; }
.search-input:focus { outline: none; border-color: var(--color-primary); }
.search-status { color: var(--color-primary); font-weight: 500; }
.length-warning { color: #ef4444; font-weight: 500; }
</style>
