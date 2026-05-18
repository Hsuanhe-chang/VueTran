<script setup>
/** Q11 — 參考答案：Lifecycle Hooks */
import { ref, onMounted, onBeforeUnmount, onUpdated } from 'vue'

const isLoading = ref(true)
const data = ref(null)
const updateCount = ref(0)
const lifecycleLog = ref([])

function addLog(msg) {
  lifecycleLog.value.push(`[${new Date().toLocaleTimeString()}] ${msg}`)
}

let loadingTimer = null

// onMounted：元件掛載到 DOM 後執行（適合啟動 API 請求）
onMounted(() => {
  addLog('onMounted 觸發：元件已掛載到 DOM')

  // 模擬 API 請求：1.5 秒後回傳資料
  loadingTimer = setTimeout(() => {
    data.value = { title: 'Vue 3 資料', count: 42 }
    isLoading.value = false
    addLog('資料載入完成')
  }, 1500)
})

// onBeforeUnmount：元件即將卸載時清除計時器
// 若不清除，元件卸載後 timer 仍然執行，可能導致記憶體洩漏或操作已卸載的元件
onBeforeUnmount(() => {
  clearTimeout(loadingTimer)
  addLog('onBeforeUnmount：清除計時器')
})

// onUpdated：每次響應式資料更新且 DOM 重新渲染後觸發
onUpdated(() => {
  updateCount.value++
  // 注意：不要在 onUpdated 中修改響應式資料，否則會造成無限循環！
  // 這裡用 console.log 或操作 non-reactive 變數是安全的
  console.log(`第 ${updateCount.value} 次 DOM 更新`)
})
</script>

<template>
  <div class="lifecycle-demo answer">
    <h3>⏱️ Lifecycle Hooks 練習（參考答案）</h3>

    <div v-if="isLoading" class="loading-spinner">⏳ 資料載入中...</div>
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
.lifecycle-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px solid var(--color-primary); }
.loading-spinner { text-align: center; padding: var(--space-xl); font-size: 1.2rem; color: var(--color-text-muted); }
.data-card h4 { color: var(--color-primary); margin-bottom: var(--space-sm); }
.log-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { margin-bottom: var(--space-sm); }
.log-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.log-item { font-family: var(--font-mono); font-size: var(--font-size-sm); color: var(--color-primary); }
.empty-log { color: var(--color-text-muted); font-size: var(--font-size-sm); }
</style>
