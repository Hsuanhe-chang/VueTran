<script setup lang="ts">
/** Q05 — Suspense 與非同步元件（練習）
 *
 *  Suspense 讓你在非同步元件載入完成前顯示 fallback UI（骨架屏/Loading）。
 *  適用情境：
 *  1. defineAsyncComponent(() => import('./HeavyComponent.vue'))
 *  2. 含有 await 的 async setup()（本題示範此用法）
 *
 *  TODO 1：把 <AsyncCard> 包進 <Suspense>，提供 #default 與 #fallback 插槽
 *  TODO 2：加入 onErrorCaptured 捕捉非同步錯誤
 *           → 將 err.message 存入 errorMsg；回傳 false 阻止向上傳播
 */
import { ref, defineComponent } from 'vue'
// TODO 2：在 import 中補上 onErrorCaptured
// import { ref, defineComponent, onErrorCaptured } from 'vue'

// ── 控制旗標 ─────────────────────────────────────────────
const shouldFail = ref(false)  // true → mockFetchUser 拋出錯誤
const loadKey   = ref(0)        // 遞增此值 → AsyncCard 重新掛載
const errorMsg  = ref('')       // onErrorCaptured 捕捉到的錯誤訊息
const triggered = ref(false)    // 是否已點擊「載入」按鈕

// ── 模擬非同步 API（延遲 1.5 秒）────────────────────────
function mockFetchUser() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail.value) {
        reject(new Error('伺服器錯誤 (500)：無法取得使用者資料'))
      } else {
        resolve({ name: '王小明', role: '前端工程師', level: 'Senior', avatar: '👨‍💻' })
      }
    }, 1500)
  })
}

// ── 非同步子元件（async setup）───────────────────────────
// 重點：Suspense 會等待 async setup() 中所有 await 完成後，才切換到 #default slot
// 若沒有 Suspense 包裹，元件在 await 期間什麼都不渲染（無 fallback）
const AsyncCard = defineComponent({
  async setup() {
    // 此 await 讓 Suspense 進入等待狀態（顯示 #fallback slot）
    const user = await mockFetchUser()
    return { user }
  },
  template: `
    <div class="user-card">
      <div class="avatar">{{ user.avatar }}</div>
      <div class="user-info">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-role">{{ user.role }}</p>
        <span class="user-badge">{{ user.level }}</span>
      </div>
    </div>
  `
})

// 重新載入：清除舊錯誤並遞增 key，強制 AsyncCard 重新掛載
function reload() {
  errorMsg.value = ''
  triggered.value = true
  loadKey.value++
}

// TODO 2：在這裡呼叫 onErrorCaptured 捕捉 AsyncCard 的非同步錯誤
// 提示：
// onErrorCaptured((err) => {
//   errorMsg.value = err.message
//   return false  // 阻止錯誤繼續向上傳播（false = 已處理）
// })
</script>

<template>
  <div class="suspense-demo">
    <h3>⏳ Q05 — Suspense 與非同步元件（練習）</h3>

    <section class="demo-section">
      <h4>非同步使用者卡片</h4>

      <!-- 操作列 -->
      <div class="controls">
        <button class="btn btn-sm" @click="reload">🔄 載入 / 重新載入</button>
        <label class="toggle-label">
          <input type="checkbox" v-model="shouldFail" />
          <span>模擬錯誤</span>
        </label>
      </div>

      <!-- 錯誤訊息（由 onErrorCaptured 捕捉後顯示）-->
      <div v-if="errorMsg" class="error-box">❌ {{ errorMsg }}</div>

      <!-- 卡片區域 -->
      <div class="card-area">
        <!-- 載入前的提示 -->
        <p v-if="!triggered" class="hint">點擊上方按鈕開始載入</p>

        <!-- TODO 1：目前 AsyncCard 沒有 Suspense 包裹               -->
        <!-- 現象：載入期間（1.5s）什麼都不顯示（沒有骨架屏）           -->
        <!-- 修正：用 <Suspense> 包住，並提供 #fallback 骨架屏 slot    -->
        <!--                                                          -->
        <!-- <Suspense>                                                -->
        <!--   <template #default>                                    -->
        <!--     <AsyncCard v-if="triggered && !errorMsg"             -->
        <!--                :key="loadKey" />                         -->
        <!--   </template>                                            -->
        <!--   <template #fallback>                                   -->
        <!--     <div class="skeleton">                               -->
        <!--       <div class="skeleton-avatar"></div>                -->
        <!--       <div class="skeleton-lines">                       -->
        <!--         <div class="skeleton-line"></div>                -->
        <!--         <div class="skeleton-line short"></div>          -->
        <!--       </div>                                             -->
        <!--     </div>                                               -->
        <!--   </template>                                            -->
        <!-- </Suspense>                                              -->
        <AsyncCard v-if="triggered && !errorMsg" :key="loadKey" />
      </div>
    </section>

    <!-- 語法說明 -->
    <section class="demo-section">
      <h4>Suspense + onErrorCaptured 語法提示</h4>
      <pre v-pre class="code-block"><!-- 包住含 async setup() 的元件 -->
<Suspense>
  <template &#35;default>
    <AsyncCard />    <!-- async setup() 元件：await 期間顯示 fallback -->
  </template>
  <template &#35;fallback>
    <div class="skeleton">載入中…</div>
  </template>
</Suspense>

// 在父元件捕捉子元件的非同步錯誤
onErrorCaptured((err) => {
  errorMsg.value = err.message
  return false  // false = 已處理，停止向上傳播
})</pre>
    </section>
  </div>
</template>

<style scoped>
.suspense-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.controls { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.toggle-label { display: flex; align-items: center; gap: 6px; font-size: var(--font-size-sm); cursor: pointer; }
.card-area { min-height: 80px; display: flex; align-items: center; padding: var(--space-sm) 0; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.error-box { background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); color: #dc2626; font-size: var(--font-size-sm); }
/* 子元件（defineComponent template）的 DOM 不在 scoped 範圍，需用 :deep() */
:deep(.user-card) { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-lg); border: 1px solid var(--color-border); min-width: 260px; }
:deep(.avatar) { font-size: 2.5rem; line-height: 1; }
:deep(.user-info) { display: flex; flex-direction: column; gap: 4px; }
:deep(.user-name) { font-weight: 700; font-size: 1rem; margin: 0; }
:deep(.user-role) { font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0; }
:deep(.user-badge) { font-size: 0.75rem; padding: 2px 8px; background: rgba(99,102,241,0.12); color: var(--color-primary); border-radius: 99px; align-self: flex-start; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
