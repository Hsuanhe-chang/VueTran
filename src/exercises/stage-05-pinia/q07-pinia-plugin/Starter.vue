<script setup>
/** Q07 — Pinia Plugin 開發（填空）
 *
 *  Pinia Plugin 讓你為「所有 Store」統一加入屬性或行為。
 *  安裝方式：pinia.use(plugin)（在 main.js 中，createPinia() 之後）
 *
 *  Plugin 函式簽名：
 *    ({ store, pinia, app, options }) => void
 *
 *  常見用途：
 *    - 為每個 store 加入 $reset()
 *    - 持久化（讀寫 localStorage）
 *    - 日誌記錄（store.$onAction）
 *
 *  本題因為 Plugin 需要在 createPinia() 後呼叫，
 *  所以改為示範 Plugin 函式的寫法，並用互動 Demo 展示效果。
 */
import { ref, computed } from 'vue'
import { defineStore }   from 'pinia'

// ── 示範用 Store ─────────────────────────────────────────────────
const useSettingsStore = defineStore('settings-q07', {
  state: () => ({
    theme:    'light',  // 'light' | 'dark'
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

// ── 日誌記錄（模擬 Plugin 的 $onAction 功能）─────────────────────
// 在實際 Plugin 中：store.$onAction(({ name, args, after, onError }) => { ... })
// 這裡我們在元件層級模擬訂閱，展示相同的效果
const actionLog = ref([])

// TODO 1：呼叫 store.$onAction，訂閱所有 action
// 當任何 action 執行時，將 `${name}(${args.join(', ')})` push 進 actionLog
// 提示：store.$onAction(({ name, args }) => { ... })
/* TODO */

// ── 手動持久化（模擬 Plugin 的持久化功能）───────────────────────
// 在實際 Plugin 中：watch(store.$state, val => localStorage.setItem(...))
// 這裡展示概念

// TODO 2：把 store.theme 的當前值讀取出來並顯示在 persistedValue 中
// 提示：computed(() => localStorage.getItem('settings-theme') ?? '(未儲存)')
const persistedValue = /* TODO: computed */ null

function saveToStorage() {
  // TODO 3：把 store.theme 儲存到 localStorage（key: 'settings-theme'）
  /* TODO */
}

function loadFromStorage() {
  // TODO 4：從 localStorage 讀取 'settings-theme' 並更新 store.theme
  /* TODO */
}
</script>

<template>
  <div class="plugin-demo">
    <h3>🍍 Q07 — Pinia Plugin 開發（練習）</h3>

    <!-- ── Plugin 概念說明 ── -->
    <section class="demo-section">
      <h4>Plugin 安裝位置（main.js）</h4>
      <pre v-pre class="code-block">// main.js
import { createPinia }     from 'pinia'
import { persistPlugin }   from './plugins/persist'
import { loggerPlugin }    from './plugins/logger'

const pinia = createPinia()

// 安裝 Plugin（必須在 app.use(pinia) 之前）
pinia.use(persistPlugin)
pinia.use(loggerPlugin)

app.use(pinia)</pre>
    </section>

    <!-- ── 設定 Store 控制 ── -->
    <section class="demo-section">
      <h4>Settings Store 操作</h4>
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
    </section>

    <!-- ── TODO 1：Action 日誌 ── -->
    <section class="demo-section">
      <h4>Action 日誌（TODO 1：store.$onAction）</h4>
      <p class="hint">完成 TODO 1 後，每次操作 store 都會記錄在此</p>
      <div v-if="actionLog.length" class="log-list">
        <div v-for="(entry, i) in actionLog.slice(-5)" :key="i" class="log-entry">
          {{ entry }}
        </div>
      </div>
      <p v-else class="hint">尚無 action 記錄</p>
      <button class="btn btn-sm btn-outline" @click="actionLog = []">清除日誌</button>
    </section>

    <!-- ── TODO 2/3/4：持久化 ── -->
    <section class="demo-section">
      <h4>持久化 Demo（TODO 2/3/4）</h4>
      <div class="persist-row">
        <span class="ctrl-label">localStorage 值</span>
        <span class="ctrl-value mono">{{ persistedValue }}</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-sm" @click="saveToStorage">儲存到 localStorage</button>
        <button class="btn btn-sm btn-outline" @click="loadFromStorage">從 localStorage 讀取</button>
      </div>
    </section>

    <!-- ── Plugin 寫法說明 ── -->
    <section class="demo-section">
      <h4>三種常見 Plugin 模式</h4>
      <pre v-pre class="code-block">// ① 日誌 Plugin（$onAction）
export function loggerPlugin({ store }) {
  store.$onAction(({ name, args, after, onError }) => {
    console.log(`[${store.$id}] ${name}(${args.join(', ')})`)
    after(result => console.log('成功', result))
    onError(err  => console.error('失敗', err))
  })
}

// ② 持久化 Plugin
export function persistPlugin({ store }) {
  // 啟動時讀取
  const saved = localStorage.getItem(store.$id)
  if (saved) store.$patch(JSON.parse(saved))

  // state 變化時寫入
  store.$subscribe((mutation, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state))
  })
}

// ③ 重置 Plugin（$reset 對 Setup Store 不自動存在）
export function resetPlugin({ store }) {
  const initial = structuredClone(toRaw(store.$state))
  store.$reset  = () => store.$patch(structuredClone(initial))
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
.ctrl-label { font-family: var(--font-mono); color: var(--color-text-muted); font-size: var(--font-size-sm); min-width: 80px; }
.ctrl-value { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; font-size: var(--font-size-sm); }
.ctrl-value.mono { word-break: break-all; }
.btn-group { display: flex; gap: 4px; }
.cat-btn { padding: 4px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.slider { flex: 1; }
.log-list { display: flex; flex-direction: column; gap: 3px; max-height: 120px; overflow-y: auto; }
.log-entry { font-size: 0.75rem; font-family: var(--font-mono); padding: 2px 8px; background: var(--color-bg); border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary); color: var(--color-text-muted); }
.persist-row { display: flex; align-items: center; gap: var(--space-sm); }
.btn-row { display: flex; gap: 6px; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 5px 14px; font-size: 0.8rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
