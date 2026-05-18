<script setup>
/** Q06 — Plugin 開發與安裝（填空）
 *
 *  Plugin 是封裝全域功能的標準方式：
 *  - app.component()  → 全域元件
 *  - app.directive()  → 全域自訂指令
 *  - app.provide()    → 提供 inject 可取得的值
 *  - app.config.globalProperties → Options API 的 this.xxx
 *
 *  Plugin 格式（物件形式）：
 *  {
 *    install(app, options) {
 *      // app = Vue 應用程式實例
 *      // options = app.use(plugin, options) 傳入的第二個參數
 *    }
 *  }
 *
 *  注意：在 <script setup> 的單一元件中無法直接執行 app.use()，
 *        這裡我們改用手動呼叫 install(mockApp) 來模擬插件安裝的過程，
 *        幫助你理解 install 函式的運作原理。
 */
import { ref, inject, provide } from 'vue'

// ── 翻譯對照表（模擬 i18n 資源） ─────────────────────────────
const messages = {
  'app.title':       '我的 Vue 應用',
  'nav.home':        '首頁',
  'nav.about':       '關於我們',
  'nav.settings':    '設定',
  'greeting.hello':  '你好！',
  'greeting.welcome':'歡迎使用 Vue 3',
  'button.submit':   '送出',
  'button.cancel':   '取消',
}

// ── i18nPlugin：國際化插件 ────────────────────────────────────
const i18nPlugin = {
  // install 是插件的進入點；app.use(i18nPlugin, options) 時被呼叫
  install(app, options) {
    // TODO 1：定義翻譯函式
    //   - 從 options.messages[key] 查找翻譯字串
    //   - 若找不到，直接回傳 key 本身（防止畫面顯示 undefined）
    function translate(key) {
      // 請實作：return options.messages?.[key] ?? key
      return key  // ← 替換這行
    }

    // TODO 2：透過 app.provide 讓所有子元件都能 inject('translate') 取得翻譯函式
    // app.provide(/* TODO */)

    // TODO 3：掛載到 globalProperties，讓 Options API 元件可用 this.$t(key)
    // app.config.globalProperties.$t = /* TODO */
  }
}

// ── 模擬安裝（本元件中無法用 app.use，故手動呼叫 install）────
// 建立一個 mock app 物件，讓 provide 的值流到元件的 inject
const provideMap = {}
const mockApp = {
  config: { globalProperties: {} },
  // 將 app.provide 的值轉為元件內的 provide（讓 inject 可以取到）
  provide(key, value) { provideMap[key] = value },
}

// 執行插件安裝（傳入 messages 作為 options）
i18nPlugin.install(mockApp, { messages })

// 將 provideMap 中的值 provide 到元件樹
// （實際專案中 app.use() 會自動處理，這裡只是模擬）
for (const [key, value] of Object.entries(provideMap)) {
  provide(key, value)
}

// ── 元件使用翻譯函式 ─────────────────────────────────────────
// 透過 inject 取得 translate 函式（與實際安裝插件後一致）
const translate = inject('translate', (key) => key)  // 第二個參數為 fallback

// 示範用：切換顯示不同翻譯 key
const demoKeys = Object.keys(messages)
const selectedKey = ref('app.title')
</script>

<template>
  <div class="plugin-demo">
    <h3>🔌 Q06 — Plugin 開發（練習）</h3>

    <!-- 翻譯函式測試 -->
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

    <!-- 所有翻譯一覽 -->
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

    <!-- 填空提示 -->
    <section class="demo-section">
      <h4>填空位置提示</h4>
      <pre class="code-block">install(app, options) {
  // TODO 1：翻譯函式
  function translate(key) {
    return options.messages?.[key] ?? key
  }

  // TODO 2：讓子元件可以 inject('translate')
  app.provide('translate', translate)

  // TODO 3：Options API 支援（this.$t）
  app.config.globalProperties.$t = translate
}</pre>
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
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
