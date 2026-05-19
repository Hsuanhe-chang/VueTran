<script setup lang="ts">
/** Q01 — KeepAlive 快取元件狀態（填空 + 找錯誤）
 *
 *  KeepAlive 包住動態元件，讓離開的元件實例被快取而非銷毀。
 *  include / exclude：依元件 name 選項決定哪些要快取。
 *  max：最多快取幾個實例（超過時用 LRU 策略淘汰最舊的）。
 */
// TODO 1：補上 onActivated（KeepAlive 快取恢復時呼叫的 hook）
import { ref, computed, defineComponent /* TODO: , onActivated */ } from 'vue'

// ── 計數器 Tab（需要被快取）────────────────────────────────────────
const CounterTab = defineComponent({
  // ⚠️ name 選項是 KeepAlive include/exclude 的依據！
  name: 'CounterTab',
  setup() {
    const count       = ref(0)
    const activateLog = ref([])

    // TODO 2：補上 onActivated hook
    // 當此元件從快取中恢復顯示時，push 一條 '已從快取恢復：HH:MM:SS' 到 activateLog
    /* TODO */

    return { count, activateLog }
  },
  template: `
    <div class="tab-content counter-tab">
      <div class="counter-row">
        <button class="btn btn-outline btn-sm" @click="count--">－</button>
        <span class="count-num">{{ count }}</span>
        <button class="btn btn-sm" @click="count++">＋</button>
      </div>
      <p class="hint">切換 Tab 再回來，count 應保持不變（KeepAlive 生效時）</p>
      <div v-if="activateLog.length" class="activate-log">
        <p class="log-title">onActivated 觸發記錄：</p>
        <div v-for="(entry, i) in activateLog" :key="i" class="log-entry">{{ entry }}</div>
      </div>
      <p v-else class="hint">完成 TODO 2 後，此處會顯示快取恢復記錄</p>
    </div>
  `
})

// ── 表單 Tab（需要被快取）─────────────────────────────────────────
const FormTab = defineComponent({
  name: 'FormTab',
  setup() {
    const username = ref('')
    const email    = ref('')
    return { username, email }
  },
  template: `
    <div class="tab-content form-tab">
      <div class="form-group">
        <label class="form-label">姓名</label>
        <input v-model="username" class="form-input" placeholder="輸入姓名…" />
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input v-model="email" class="form-input" placeholder="輸入 Email…" />
      </div>
      <p class="hint">切換 Tab 再回來，輸入內容應保持（KeepAlive 生效時）</p>
    </div>
  `
})

// ── 公告 Tab（不快取，每次進入都重置）────────────────────────────
const AnnouncementTab = defineComponent({
  name: 'AnnouncementTab',
  setup() { return {} },
  template: `
    <div class="tab-content announcement-tab">
      <p>📢 最新公告：Vue 3.5 已正式發布！</p>
      <p class="hint">此 Tab 不快取：每次切換都是新實例</p>
    </div>
  `
})

const currentTab = ref('CounterTab')
const tabs = [
  { name: 'CounterTab',      label: '計數器 🔢', component: CounterTab },
  { name: 'FormTab',         label: '表單 📝',    component: FormTab },
  { name: 'AnnouncementTab', label: '公告 📢',    component: AnnouncementTab },
]
const currentComponent = computed(() => tabs.find(t => t.name === currentTab.value)?.component)
</script>

<template>
  <div class="keep-alive-demo">
    <h3>🔄 Q01 — KeepAlive 快取元件狀態（練習）</h3>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-btn"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >{{ tab.label }}</button>
    </div>

    <!-- ❌ Bug A：include 值不符合元件 name（'Counter,Form' ≠ 'CounterTab','FormTab'） -->
    <!-- ❌ Bug B：max 傳了字串 '2' 應為數字 2 -->
    <KeepAlive :include="'Counter,Form'" :max="'2'">
      <component :is="currentComponent" />
    </KeepAlive>

    <section class="demo-section">
      <h4>KeepAlive 重點</h4>
      <pre v-pre class="code-block"><!-- include 值需與元件 name 選項完全一致 -->
<KeepAlive :include="['CounterTab', 'FormTab']" :max="2">
  <component :is="currentComponent" />
</KeepAlive>

// 快取元件的生命週期：
// onActivated   — 從快取恢復時觸發（替代 onMounted）
// onDeactivated — 進入快取時觸發（替代 onUnmounted）</pre>
    </section>
  </div>
</template>

<style scoped>
.keep-alive-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.tab-bar { display: flex; gap: 4px; background: var(--color-bg-card); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.tab-btn { flex: 1; padding: 8px; border: none; border-radius: var(--radius-sm); cursor: pointer; background: transparent; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: 500; }
.tab-btn.active { background: var(--color-primary); color: #fff; }
.tab-content { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); min-height: 120px; display: flex; flex-direction: column; gap: var(--space-sm); }
.counter-tab .counter-row { display: flex; align-items: center; gap: var(--space-md); }
.count-num { font-size: 2rem; font-weight: 700; color: var(--color-primary); min-width: 60px; text-align: center; font-family: var(--font-mono); }
.form-tab .form-group { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: var(--font-size-sm); font-weight: 500; }
.form-input { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; }
.activate-log { display: flex; flex-direction: column; gap: 3px; }
.log-title { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-secondary); }
.log-entry { font-size: 0.75rem; font-family: var(--font-mono); color: var(--color-text-muted); padding: 2px 6px; background: var(--color-bg); border-radius: var(--radius-sm); border-left: 3px solid var(--color-primary); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
