<script setup lang="ts">
/** Q05 — 環境變數管理（import.meta.env）（填空）
 *
 *  Vite 透過 import.meta.env 暴露環境變數：
 *  - 內建：MODE / BASE_URL / PROD / DEV（Vite 自動提供）
 *  - 自訂：需以 VITE_ 為前綴（在 .env 檔案中定義）
 *
 *  TODO 1：填入正確的 import.meta.env.XXX 讀取當前模式
 *  TODO 2：填入讀取 BASE_URL 的屬性名稱
 *  TODO 3：填入判斷是否為生產環境的 boolean 屬性
 *  TODO 4：填入判斷是否為開發環境的 boolean 屬性
 *  TODO 5：填入讀取自訂 VITE_API_URL 變數的完整路徑
 */

// ── 讀取 Vite 內建環境變數 ──────────────────────────────
const envConfig = {
  // TODO 1：當前執行模式（'development' / 'production' / 'test'）
  mode: /* TODO 1：import.meta.env.___ */ '???',

  // TODO 2：應用部署的基礎路徑（vite.config.js base 設定，預設 '/'）
  baseUrl: /* TODO 2：import.meta.env.___ */ '???',

  // TODO 3：是否為生產環境（布林值，production 時為 true）
  isProd: /* TODO 3：import.meta.env.___ */ false,

  // TODO 4：是否為開發環境（布林值，development 時為 true）
  isDev: /* TODO 4：import.meta.env.___ */ false,

  // TODO 5：讀取自訂環境變數（需在 .env 檔案中定義 VITE_API_URL=...）
  // 若未定義則顯示佔位提示
  // TODO 5：將此行替換為：import.meta.env.VITE_API_URL ?? '未設定（需在 .env 加入 VITE_API_URL）'
  apiUrl: '未設定（需在 .env 加入 VITE_API_URL）',
}
</script>

<template>
  <div class="env-demo">
    <h3>⚙️ Q05 — 環境變數管理（填空）</h3>

    <!-- 當前環境資訊 -->
    <section class="demo-section">
      <h4>當前環境資訊（填完 TODO 後才顯示正確值）</h4>
      <div class="env-grid">
        <div class="env-row">
          <span class="env-key">import.meta.env.MODE</span>
          <span class="env-value" :class="{ todo: envConfig.mode === '???' }">
            {{ envConfig.mode }}
          </span>
          <span class="env-desc">當前模式（development / production）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.BASE_URL</span>
          <span class="env-value" :class="{ todo: envConfig.baseUrl === '???' }">
            {{ envConfig.baseUrl }}
          </span>
          <span class="env-desc">部署基礎路徑（預設 /）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.PROD</span>
          <span class="env-value" :class="{ correct: !envConfig.isProd }">
            {{ envConfig.isProd }}
          </span>
          <span class="env-desc">是否為生產環境（bool）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.DEV</span>
          <span class="env-value" :class="{ correct: envConfig.isDev }">
            {{ envConfig.isDev }}
          </span>
          <span class="env-desc">是否為開發環境（bool）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.VITE_API_URL</span>
          <span class="env-value muted">{{ envConfig.apiUrl }}</span>
          <span class="env-desc">自訂變數（需在 .env 定義）</span>
        </div>
      </div>
    </section>

    <!-- .env 檔案格式說明 -->
    <section class="demo-section">
      <h4>.env 檔案格式（在專案根目錄建立）</h4>
      <pre v-pre class="code-block"># .env（所有模式共用）
VITE_API_URL=https://api.example.com
VITE_APP_NAME=VueTranByClaude

# .env.development（開發環境）
VITE_API_URL=http://localhost:3000

# .env.production（生產環境）
VITE_API_URL=https://api.prod.example.com

# ⚠️ 沒有 VITE_ 前綴的變數不會暴露給瀏覽器
SECRET_KEY=此變數在瀏覽器中讀不到</pre>
    </section>

    <!-- 使用方式說明 -->
    <section class="demo-section">
      <h4>import.meta.env 填空提示</h4>
      <pre v-pre class="code-block">// 內建變數（Vite 自動提供）
import.meta.env.MODE      → 'development' / 'production' / 'test'
import.meta.env.BASE_URL  → '/' （或 vite.config.js 的 base 值）
import.meta.env.PROD      → boolean（production 時為 true）
import.meta.env.DEV       → boolean（development 時為 true）

// 自訂變數（需在 .env 定義，必須有 VITE_ 前綴）
import.meta.env.VITE_API_URL   → 'https://api.example.com'
import.meta.env.VITE_APP_NAME  → 'MyApp'</pre>
    </section>
  </div>
</template>

<style scoped>
.env-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.env-grid { display: flex; flex-direction: column; gap: 8px; }
.env-row { display: grid; grid-template-columns: 260px 140px 1fr; align-items: center; gap: var(--space-sm); padding: 6px 8px; background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-sm); }
.env-key { font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-primary); }
.env-value { font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: var(--color-border); }
.env-value.todo    { background: #fef3c7; color: #92400e; }
.env-value.correct { background: #dcfce7; color: #16a34a; }
.env-value.muted   { color: var(--color-text-muted); }
.env-desc { font-size: 0.75rem; color: var(--color-text-muted); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
