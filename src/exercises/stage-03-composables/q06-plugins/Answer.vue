<script setup lang="ts">
/** Q06 — Plugin 開發與安裝（解答）
 *
 *  核心概念：
 *  1. Plugin 必須實作 install(app, options) 方法
 *  2. install 接受 app 實例，可呼叫 app.component()、app.directive()、app.provide()、
 *     app.config.globalProperties 掛載全域功能
 *  3. app.provide(key, value) 讓整棵元件樹的 inject(key) 都能取到值
 *  4. app.config.globalProperties 讓 Options API 的 this.xxx 可用
 *
 *  實際使用方式：
 *  // main.js
 *  import { createApp } from 'vue'
 *  import i18nPlugin from './plugins/i18n'
 *  const app = createApp(App)
 *  app.use(i18nPlugin, { messages: { 'hello': '你好' } })
 *  app.mount('#app')
 */
import { ref, inject, provide, type App } from 'vue'

// ── 翻譯對照表 ────────────────────────────────────────────
const messages: Record<string, string> = {
  'app.title':       '我的 Vue 應用',
  'nav.home':        '首頁',
  'nav.about':       '關於我們',
  'nav.settings':    '設定',
  'greeting.hello':  '你好！',
  'greeting.welcome':'歡迎使用 Vue 3',
  'button.submit':   '送出',
  'button.cancel':   '取消',
}

// ── i18nPlugin：完整實作 ──────────────────────────────────────
const i18nPlugin = {
  // install 是插件的進入點；app.use(i18nPlugin, options) 時被呼叫
  install(app: App, options?: { messages?: Record<string, string> }) {
    // 翻譯函式：從 options.messages 查找 key 對應的字串
    // 若 key 不存在，回傳 key 本身（避免畫面出現 undefined / 空白）
    function translate(key: string): string {
      return options?.messages?.[key] ?? key
    }

    // 讓整棵元件樹都能用 inject('translate') 取得翻譯函式
    // （Composition API 使用方式）
    app.provide('translate', translate)

    // 掛載到 globalProperties，讓 Options API 元件用 this.$t(key)
    app.config.globalProperties.$t = translate
  }
}

// ── 模擬安裝（單一元件無法呼叫 app.use，以下模擬 main.js 的行為）
const provideMap: Record<string, unknown> = {}
const mockApp = {
  config: { globalProperties: {} as Record<string, unknown> },
  provide(key: string, value: unknown) { provideMap[key] = value },
}
i18nPlugin.install(mockApp as unknown as App, { messages })

// 將 install 中 app.provide 的值橋接到元件 provide
for (const [key, value] of Object.entries(provideMap)) {
  provide(key, value)
}

// ── 元件取得翻譯函式 ──────────────────────────────────────────
// key 參數明確為 string，避免 TS7006 隱含 any 錯誤
const translate = inject('translate', (key: string) => key)

const demoKeys  = Object.keys(messages)
const selectedKey = ref('app.title')
</script>

<template>
  <div class="plugin-demo">
    <h3>🔌 Q06 — Plugin 開發（解答）</h3>

    <section class="demo-section">
      <h4>i18nPlugin 翻譯測試</h4>

      <div class="key-picker">
        <label>選擇翻譯 key：</label>
        <select v-model="selectedKey" class="demo-select">
          <option v-for="key in demoKeys" :key="key" :value="key">{{ key }}</option>
        </select>
      </div>

      <div class="translation-result">
        <p class="result-label">translate('{{ selectedKey }}')</p>
        <p class="result-value">→ {{ translate(selectedKey) }}</p>
      </div>
    </section>

    <section class="demo-section">
      <h4>所有翻譯對照</h4>
      <div class="translation-table">
        <div v-for="key in demoKeys" :key="key" class="translation-row">
          <span class="key-cell">{{ key }}</span>
          <span class="arrow">→</span>
          <span class="value-cell">{{ translate(key) }}</span>
        </div>
      </div>
    </section>

    <!-- 解答說明 -->
    <section class="demo-section answer-section">
      <h4>✅ i18nPlugin 完整實作</h4>
      <pre class="code-block">const i18nPlugin = {
  install(app, options) {
    // 查找翻譯；找不到時 fallback 為 key 本身
    function translate(key) {
      return options.messages?.[key] ?? key
    }

    // Composition API：inject('translate') 取得
    app.provide('translate', translate)

    // Options API：this.$t(key) 取得
    app.config.globalProperties.$t = translate
  }
}

// main.js 使用：
// app.use(i18nPlugin, { messages: { 'hello': '你好' } })

// 元件中使用（Composition API）：
// const t = inject('translate')
// t('hello')  // → '你好'</pre>
    </section>
  </div>
</template>

<style scoped>
.plugin-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.key-picker { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.demo-select { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.translation-result { display: flex; flex-direction: column; gap: 4px; padding: var(--space-sm) var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.result-label { font-size: var(--font-size-sm); color: var(--color-text-muted); font-family: var(--font-mono); }
.result-value { font-size: 1.4rem; font-weight: 600; color: var(--color-primary); font-family: var(--font-mono); }
.translation-table { display: flex; flex-direction: column; gap: 6px; }
.translation-row { display: flex; align-items: center; gap: var(--space-sm); padding: 6px var(--space-sm); background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-sm); }
.key-cell { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 160px; }
.arrow { color: var(--color-border); }
.value-cell { font-weight: 500; color: var(--color-text); }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
