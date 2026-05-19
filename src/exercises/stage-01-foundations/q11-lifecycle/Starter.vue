<script setup lang="ts">
/** Q11 — Lifecycle Hooks（填空題）
 *  現況：基礎架構已完成，你需要在正確的生命週期鉤子中加入邏輯
 */
import { ref, onMounted, onBeforeUnmount, onUpdated } from 'vue'

const isLoading = ref(true)
const data = ref<{ title: string; count: number } | null>(null)
const updateCount = ref(0)
const lifecycleLog = ref<string[]>([])

function addLog(msg: string): void {
  lifecycleLog.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

let loadingTimer: ReturnType<typeof setTimeout> | null = null

// TODO 1: 在 onMounted 中：
//   a. addLog('onMounted 觸發：元件已掛載到 DOM')
//   b. 用 setTimeout（1500ms）模擬 API 請求
//      → 設定 data.value = { title: 'Vue 3 資料', count: 42 }
//      → 設定 isLoading.value = false
//      → addLog('資料載入完成')
//      → 把 timer 存入 loadingTimer（用於 onBeforeUnmount 清除）
onMounted(() => {
  // 請實作這裡
  addLog('onMounted 觸發（你的邏輯應從這裡開始）')
})

// TODO 2: 在 onBeforeUnmount 中清除 loadingTimer
//         clearTimeout(loadingTimer)
onBeforeUnmount(() => {
  // 請實作這裡（清除 timer）
})

// TODO 3: 在 onUpdated 中記錄更新次數
//         updateCount.value++
//         （注意：不要在 onUpdated 中修改響應式資料，會造成無限循環）
onUpdated(() => {
  // 請實作這裡
})
</script>

<template>
  <div class="lifecycle-demo">
    <h3>⏱️ Lifecycle Hooks 練習</h3>

    <div v-if="isLoading" class="loading-spinner">
      ⏳ 資料載入中...（完成 onMounted 後會在 1.5 秒後顯示資料）
    </div>

    <div v-else class="data-card card">
      <h4>✅ 資料載入完成</h4>
      <p>標題：{{ data?.title }}</p>
      <p>數量：{{ data?.count }}</p>
    </div>

    <div class="log-section">
      <h4>📋 Lifecycle 觸發記錄</h4>
      <ul class="log-list">
        <li v-for="(log, i) in lifecycleLog" :key="i" class="log-item">{{ log }}</li>
      </ul>
      <p v-if="lifecycleLog.length === 0" class="empty-log">（尚無記錄）</p>
    </div>
  </div>
</template>

<style scoped>
.lifecycle-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.loading-spinner { text-align: center; padding: var(--space-xl); font-size: 1.2rem; color: var(--color-text-muted); }
.data-card h4 { color: var(--color-primary); margin-bottom: var(--space-sm); }
.log-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { margin-bottom: var(--space-sm); }
.log-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.log-item { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); }
.empty-log { color: var(--color-text-muted); font-size: var(--font-size-sm); }
</style>
