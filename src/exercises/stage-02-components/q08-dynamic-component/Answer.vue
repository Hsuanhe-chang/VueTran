<script setup lang="ts">
/** Q08 — 動態元件（component :is）（解答）
 *
 *  核心概念：
 *  - <component :is="componentRef"> 動態渲染不同元件
 *  - :is 接受元件物件（import 進來的）或全域註冊的元件名稱字串
 *  - <KeepAlive> 包裹後，切換元件時會「快取」而非「銷毀」，保留其狀態
 */
import { ref, h, type Component } from 'vue'
const TabHome = {
  name: 'TabHome',
  setup() {
    const note = ref('')
    return { note }
  },
  // 顯式標注 this 型別，TypeScript 無法自動從 setup() 返回型推斷元件實例屬性
  render(this: { note: string }) {
    return h('div', { class: 'tab-body' }, [
      h('h4', '🏠 首頁'),
      h('p', '試著在下方輸入文字，切換 Tab 後回來——因為有 KeepAlive，文字不會消失！'),
      h('input', {
        class: 'tab-input',
        placeholder: '輸入文字，切換 Tab 再回來...',
        value: this.note,
        onInput: (e) => { this.note = (e.target as HTMLInputElement).value },  // 斷言為 HTMLInputElement 才能存取 .value
      }),
    ])
  },
}

const TabProfile = {
  name: 'TabProfile',
  render: () => h('div', { class: 'tab-body' }, [
    h('h4', '👤 個人資料'),
    h('p', '這裡是使用者個人資料頁面。'),
    h('div', { class: 'profile-mock' }, [
      h('div', { class: 'avatar' }, '👤'),
      h('div', { class: 'profile-info' }, [
        h('p', { class: 'profile-name' }, '王小明'),
        h('p', { class: 'profile-role' }, 'Vue 學習者'),
      ]),
    ]),
  ]),
}

const TabSettings = {
  name: 'TabSettings',
  render: () => h('div', { class: 'tab-body' }, [
    h('h4', '⚙️ 設定'),
    h('p', '這裡是系統設定頁面。'),
    h('div', { class: 'settings-mock' }, [
      h('label', { class: 'setting-row' }, [h('span', '深色模式'), h('input', { type: 'checkbox' })]),
      h('label', { class: 'setting-row' }, [h('span', '接收通知'), h('input', { type: 'checkbox', checked: true })]),
    ]),
  ]),
}

// Component 型別對應 Vue 元件物件，符合 <component :is> 的屬性型別要求
const tabs: { label: string; component: Component }[] = [
  { label: '🏠 首頁',  component: TabHome     },
  { label: '👤 個人',  component: TabProfile  },
  { label: '⚙️ 設定', component: TabSettings },
]

// 明確標注為 Component 型別，將來 tab.component 才能正確賦值給 activeTab
const activeTab = ref<Component>(TabHome)
</script>

<template>
  <div class="dynamic-demo">
    <h3>🔄 Q08 — 動態元件解答</h3>

    <!-- Tab 按鈕列 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        :class="['tab-btn', { active: activeTab === tab.component }]"
        @click="activeTab = tab.component"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 動態元件 + KeepAlive（保留各 Tab 的狀態，切換時不銷毀） -->
    <div class="tab-content">
      <KeepAlive>
        <component :is="activeTab" />
      </KeepAlive>
    </div>

    <!-- 解答說明 -->
    <div class="answer-block card" style="margin-top: var(--space-md);">
      <h5>✅ 動態元件 + KeepAlive</h5>
      <pre class="code-block">// 基本用法
&lt;component :is="activeTab" /&gt;

// 加上 KeepAlive：切換時保留元件狀態（不銷毀）
&lt;KeepAlive&gt;
  &lt;component :is="activeTab" /&gt;
&lt;/KeepAlive&gt;

// :is 可接受：
// 1. 元件物件（import 進來的）→ 推薦
// 2. 字串（全域註冊的元件名稱）→ 需要全域註冊</pre>
    </div>
  </div>
</template>

<style scoped>
.dynamic-demo { display: flex; flex-direction: column; gap: 0; padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h3 { margin-bottom: var(--space-md); }
h5 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.tab-bar { display: flex; gap: 2px; border-bottom: 2px solid var(--color-border); }
.tab-btn { padding: 10px 20px; border: none; background: none; cursor: pointer; font-size: var(--font-size-base); color: var(--color-text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
.tab-btn:hover:not(.active) { background: var(--color-bg-card); }
.tab-content { border: 1px solid var(--color-border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); min-height: 160px; }
.answer-block { display: flex; flex-direction: column; gap: var(--space-sm); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
:deep(.tab-body) { padding: var(--space-lg); display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.tab-body h4) { color: var(--color-secondary); margin-bottom: 4px; }
:deep(.tab-input) { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: var(--font-size-base); width: 100%; }
:deep(.profile-mock) { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); }
:deep(.avatar) { font-size: 2rem; }
:deep(.profile-name) { font-weight: 600; }
:deep(.profile-role) { font-size: var(--font-size-sm); color: var(--color-text-muted); }
:deep(.settings-mock) { display: flex; flex-direction: column; gap: var(--space-sm); }
:deep(.setting-row) { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-sm); cursor: pointer; }
</style>
