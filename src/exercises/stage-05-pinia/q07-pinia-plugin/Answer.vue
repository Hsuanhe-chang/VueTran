<script setup>
/** Q07 — Pinia Plugin 開發（解答）
 *
 *  Plugin 核心 API：
 *  - store.$onAction(cb)：訂閱 action 執行事件
 *  - store.$subscribe(cb)：訂閱 state 變化（類似 watch）
 *  - store.$patch(partial)：局部更新 state
 *  - store.$id：store 的 ID 字串
 *
 *  本題在元件層級模擬 Plugin 行為，展示相同效果。
 *  實際使用時，這些邏輯放在 pinia.use() 的 Plugin 函式中。
 */
import { ref, computed } from 'vue'
import { defineStore }   from 'pinia'

// ── 示範用 Store ─────────────────────────────────────────────────
const useSettingsStore = defineStore('settings-q07-ans', {
  state: () => ({
    theme:    'light',
    language: 'zh-TW',
    fontSize: 14,
  }),
  actions: {
    setTheme(t)    { this.theme    = t },
    setLanguage(l) { this.language = l },
    setFontSize(s) { this.fontSize = s },
  },
})

const store = useSettingsStore()

// ── TODO 1 解答：store.$onAction 訂閱所有 action ──────────────────
// $onAction 回傳 unsubscribe 函式，元件卸載時可呼叫清除監聽
const actionLog = ref([])

// 訂閱所有 action 執行
store.$onAction(({ name, args }) => {
  const argsStr = args.map(a => JSON.stringify(a)).join(', ')
  actionLog.value.push(`${name}(${argsStr})`)
})

// ── TODO 2 解答：computed 讀取 localStorage ───────────────────────
// 注意：localStorage 不是響應式的，所以這個 computed 只在初始化時讀取
// 實際應用中，需要用 ref 或自訂響應式機制
const persistedValue = computed(
  () => localStorage.getItem('settings-theme') ?? '(未儲存)'
)

// ── TODO 3 解答：儲存到 localStorage ─────────────────────────────
function saveToStorage() {
  localStorage.setItem('settings-theme', store.theme)
  // 觸發 computed 重新計算（因為 localStorage 不響應式，用 alert 告知）
  alert(`已儲存：settings-theme = "${store.theme}"`)
}

// ── TODO 4 解答：從 localStorage 讀取 ────────────────────────────
function loadFromStorage() {
  const saved = localStorage.getItem('settings-theme')
  if (saved) {
    store.setTheme(saved)  // 呼叫 action，這樣 $onAction 也會記錄
  } else {
    alert('localStorage 中尚未儲存任何值')
  }
}
</script>

<template>
  <div class="plugin-demo">
    <h3>🍍 Q07 — Pinia Plugin 開發（解答）</h3>

    <!-- ── Plugin 安裝位置說明 ── -->
    <section class="demo-section">
      <h4>Plugin 安裝位置（main.js）</h4>
      <pre v-pre class="code-block">// main.js
import { createPinia }   from 'pinia'
import { persistPlugin } from './plugins/persist'
import { loggerPlugin }  from './plugins/logger'

const pinia = createPinia()
pinia.use(persistPlugin)   // ← pinia.use() 安裝
pinia.use(loggerPlugin)

app.use(pinia)</pre>
    </section>

    <!-- ── Settings Store 操作 ── -->
    <section class="demo-section">
      <h4>Settings Store 操作（操作後觀察日誌）</h4>
      <div class="control-row">
        <span class="ctrl-label">theme</span>
        <div class="btn-group">
          <button
            v-for="t in ['light', 'dark', 'auto']"
            :key="t"
            class="cat-btn"
            :class="{ active: store.theme === t }"
            @click="store.setTheme(t)"
          >{{ t }}</button>
        </div>
      </div>
      <div class="control-row">
        <span class="ctrl-label">fontSize</span>
        <input
          type="range" min="12" max="20" step="1"
          :value="store.fontSize"
          @input="store.setFontSize(Number($event.target.value))"
          class="slider"
        />
        <span class="ctrl-value">{{ store.fontSize }}px</span>
      </div>
      <div class="control-row">
        <span class="ctrl-label">language</span>
        <div class="btn-group">
          <button
            v-for="l in ['zh-TW', 'en-US', 'ja-JP']"
            :key="l"
            class="cat-btn"
            :class="{ active: store.language === l }"
            @click="store.setLanguage(l)"
          >{{ l }}</button>
        </div>
      </div>
    </section>

    <!-- ── Action 日誌（$onAction）── -->
    <section class="demo-section">
      <h4>Action 日誌（store.$onAction）</h4>
      <div v-if="actionLog.length" class="log-list">
        <div v-for="(entry, i) in actionLog.slice(-8)" :key="i" class="log-entry">
          {{ entry }}
        </div>
      </div>
      <p v-else class="hint">操作上方 Store 後這裡會顯示記錄</p>
      <button class="btn btn-sm btn-outline" @click="actionLog = []">清除日誌</button>
    </section>

    <!-- ── 持久化 Demo ── -->
    <section class="demo-section">
      <h4>持久化 Demo（localStorage）</h4>
      <div class="persist-row">
        <span class="ctrl-label">當前 theme</span>
        <span class="ctrl-value">{{ store.theme }}</span>
      </div>
      <div class="persist-row">
        <span class="ctrl-label">localStorage</span>
        <span class="ctrl-value mono">{{ persistedValue }}</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-sm" @click="saveToStorage">儲存到 localStorage</button>
        <button class="btn btn-sm btn-outline" @click="loadFromStorage">從 localStorage 讀取</button>
      </div>
    </section>

    <!-- ── 三種 Plugin 模式 ── -->
    <section class="demo-section">
      <h4>✅ 三種常見 Plugin 完整實作</h4>
      <pre v-pre class="code-block">// ① $onAction：日誌 Plugin
export function loggerPlugin({ store }) {
  store.$onAction(({ name, args, after, onError }) => {
    const t = Date.now()
    console.log(`▶ [${store.$id}] ${name}(${args})`)
    after(result  => console.log(`✓ ${Date.now() - t}ms`, result))
    onError(error => console.error(`✗`, error))
  })
}

// ② $subscribe + $patch：持久化 Plugin
export function persistPlugin({ store }) {
  // 啟動時從 localStorage 恢復
  const key   = `pinia:${store.$id}`
  const saved = localStorage.getItem(key)
  if (saved) store.$patch(JSON.parse(saved))

  // state 任何變化都寫入 localStorage
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}

// ③ 為 Setup Store 補充 $reset（Setup Store 不自動有 $reset）
export function resetPlugin({ store, options }) {
  if (options.state) {
    // Options Store 已內建 $reset，跳過
    return
  }
  // Setup Store 需要快照初始 state
  const initialState = structuredClone(toRaw(store.$state))
  store.$reset = () => store.$patch(structuredClone(initialState))
}</pre>
    </section>
  </div>
</template>

<style scoped>
.plugin-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.control-row { display: flex; align-items: center; gap: var(--space-sm); }
.ctrl-label { font-family: var(--font-mono); color: var(--color-text-muted); font-size: var(--font-size-sm); min-width: 90px; }
.ctrl-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; font-size: var(--font-size-sm); }
.ctrl-value.mono { word-break: break-all; }
.btn-group { display: flex; gap: 4px; flex-wrap: wrap; }
.cat-btn { padding: 4px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.slider { flex: 1; }
.log-list { display: flex; flex-direction: column; gap: 3px; max-height: 160px; overflow-y: auto; }
.log-entry { font-size: 0.75rem; font-family: var(--font-mono); padding: 2px 8px; background: var(--color-bg); border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary); color: var(--color-text-muted); }
.persist-row { display: flex; align-items: center; gap: var(--space-sm); }
.btn-row { display: flex; gap: 6px; flex-wrap: wrap; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 5px 14px; font-size: 0.8rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
