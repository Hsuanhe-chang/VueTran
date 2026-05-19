<script setup lang="ts">
/** Q08 — 動態元件（component :is）（填空）
 *  根據使用者點擊的 Tab，動態渲染對應的子元件。
 */
import { ref, h, type Component } from 'vue'
// render function 是 Vue 不需要 template compiler 就能運作的寫法
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
      h('p', '歡迎使用動態元件！切換 Tab 時，此欄位的內容會被清除（除非用 KeepAlive）。'),
      h('input', {
        class: 'tab-input',
        placeholder: '試著輸入文字，再切換 Tab...',
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
      h('label', { class: 'setting-row' }, [
        h('span', '深色模式'),
        h('input', { type: 'checkbox' }),
      ]),
      h('label', { class: 'setting-row' }, [
        h('span', '接收通知'),
        h('input', { type: 'checkbox', checked: true }),
      ]),
    ]),
  ]),
}

// Tab 列表設定
// Component 型別對應 Vue 元件物件，符合 <component :is> 的屬性型別要求
const tabs: { label: string; component: Component }[] = [
  { label: '🏠 首頁',    component: TabHome     },
  { label: '👤 個人',    component: TabProfile  },
  { label: '⚙️ 設定',   component: TabSettings },
]

// 目前選中的 Tab（存放元件物件，而非字串）
// 明確標注為 Component 型別，將來 tab.component 才能正確賦值給 activeTab
const activeTab = ref<Component>(TabHome)
</script>

<template>
  <div class="dynamic-demo">
    <h3>🔄 Q08 — 動態元件練習</h3>

    <!-- ── Tab 按鈕列（已完成） ── -->
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

    <!-- ── 內容區 ── -->
    <div class="tab-content">
      <!--
        TODO：用 <component :is="activeTab"> 動態渲染目前的 Tab 元件
        語法：<component :is="要渲染的元件" />

        進階：用 <KeepAlive> 包裹後，切換 Tab 時輸入框的文字不會消失
        <KeepAlive>
          <component :is="activeTab" />
        </KeepAlive>
      -->
      <p class="hint">（在此加入 component :is 標籤）</p>
    </div>
  </div>
</template>

<style scoped>
.dynamic-demo { display: flex; flex-direction: column; gap: 0; padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h3 { margin-bottom: var(--space-md); }
.tab-bar { display: flex; gap: 2px; border-bottom: 2px solid var(--color-border); }
.tab-btn { padding: 10px 20px; border: none; background: none; cursor: pointer; font-size: var(--font-size-base); color: var(--color-text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
.tab-btn.active { color: var(--color-primary); border-bottom-color: var(--color-primary); font-weight: 600; }
.tab-btn:hover:not(.active) { background: var(--color-bg-card); }
.tab-content { border: 1px solid var(--color-border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); min-height: 160px; }
.hint { padding: var(--space-lg); color: var(--color-text-muted); font-size: var(--font-size-sm); }
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
