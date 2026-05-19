<script setup lang="ts">
/** Q01 — KeepAlive 快取元件狀態（解答）
 *
 *  修正的 2 個 Bug：
 *  Bug A：:include="'Counter,Form'" → :include="['CounterTab','FormTab']"
 *         include 值必須與元件的 name 選項完全一致
 *  Bug B：:max="'2'" → :max="2"
 *         max 需要數字型別，字串不生效
 *
 *  TODO 解答：
 *  TODO 1：import onActivated
 *  TODO 2：在 CounterTab setup 中呼叫 onActivated，記錄快取恢復時間
 */
import { ref, computed, defineComponent, onActivated } from 'vue'

const CounterTab = defineComponent({
  name: 'CounterTab',
  setup() {
    const count       = ref(0)
    const activateLog = ref<string[]>([])  // 明確標注字串陣列，避免推斷為 never[]

    // onActivated：從快取恢復時呼叫（每次 Tab 顯示都觸發）
    onActivated(() => {
      const now = new Date().toLocaleTimeString('zh-TW')
      activateLog.value.push(`已從快取恢復：${now}`)
    })

    return { count, activateLog }
  },
  template: `
    <div class="tab-content counter-tab">
      <div class="counter-row">
        <button class="btn btn-outline btn-sm" @click="count--">－</button>
        <span class="count-num">{{ count }}</span>
        <button class="btn btn-sm" @click="count++">＋</button>
      </div>
      <p class="hint">切換 Tab 再切回來，count 保持不變 ✅</p>
      <div v-if="activateLog.length" class="activate-log">
        <p class="log-title">onActivated 觸發記錄：</p>
        <div v-for="(entry, i) in activateLog" :key="i" class="log-entry">{{ entry }}</div>
      </div>
    </div>
  `
})

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
      <p class="hint">切換 Tab 再回來，輸入內容保持 ✅</p>
    </div>
  `
})

const AnnouncementTab = defineComponent({
  name: 'AnnouncementTab',
  setup() { return {} },
  template: `
    <div class="tab-content announcement-tab">
      <p>📢 最新公告：Vue 3.5 已正式發布！</p>
      <p class="hint">此 Tab 不在 include 清單，每次切換都重新 mount</p>
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
    <h3>🔄 Q01 — KeepAlive 快取元件狀態（解答）</h3>

    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-btn"
        :class="{ active: currentTab === tab.name }"
        @click="currentTab = tab.name"
      >{{ tab.label }}</button>
    </div>

    <!-- ✅ Bug A 修正：include 改為元件 name 的陣列 -->
    <!-- ✅ Bug B 修正：max 改為數字 -->
    <KeepAlive :include="['CounterTab', 'FormTab']" :max="2">
      <component :is="currentComponent" />
    </KeepAlive>

    <section class="demo-section">
      <h4>✅ 修正後的完整寫法</h4>
      <pre v-pre class="code-block"><!-- ✅ include 需完全對應 defineComponent({ name: 'CounterTab' }) 的 name -->
<KeepAlive :include="['CounterTab', 'FormTab']" :max="2">
  <component :is="currentComponent" />
</KeepAlive>

// 生命週期差異（快取中的元件）：
// 初次掛載：  setup → onMounted → onActivated
// 切換離開：  onDeactivated（非 onUnmounted）
// 切換回來：  onActivated（非 onMounted）</pre>
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
