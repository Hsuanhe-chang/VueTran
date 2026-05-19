<script setup lang="ts">
/** Q05 — 環境變數管理（import.meta.env）（解答）
 *
 *  TODO 解答：
 *  1. import.meta.env.MODE    → 當前模式字串
 *  2. import.meta.env.BASE_URL → 部署基礎路徑
 *  3. import.meta.env.PROD    → 是否生產環境（boolean）
 *  4. import.meta.env.DEV     → 是否開發環境（boolean）
 *  5. import.meta.env.VITE_API_URL → 自訂 VITE_ 前綴變數
 */

// ✅ 讀取 Vite 內建環境變數（完整解答）
const envConfig = {
  // TODO 1 解答：MODE 是當前執行模式的字串
  mode: import.meta.env.MODE,

  // TODO 2 解答：BASE_URL 是應用的部署基礎路徑
  baseUrl: import.meta.env.BASE_URL,

  // TODO 3 解答：PROD 在 vite build 後為 true，dev server 為 false
  isProd: import.meta.env.PROD,

  // TODO 4 解答：DEV 在 dev server 時為 true，build 後為 false
  isDev: import.meta.env.DEV,

  // TODO 5 解答：自訂變數需有 VITE_ 前綴，未設定則 undefined
  // ?? 運算子：左側為 null/undefined 時，使用右側預設值
  apiUrl: import.meta.env.VITE_API_URL ?? '未設定（需在 .env 加入 VITE_API_URL）',
}
</script>

<template>
  <div class="env-demo">
    <h3>⚙️ Q05 — 環境變數管理（解答）</h3>

    <!-- 當前環境資訊（解答後顯示真實值）-->
    <section class="demo-section">
      <h4>當前環境資訊（真實值）</h4>
      <div class="env-grid">
        <div class="env-row">
          <span class="env-key">import.meta.env.MODE</span>
          <span class="env-value correct">{{ envConfig.mode }}</span>
          <span class="env-desc">當前模式（development / production）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.BASE_URL</span>
          <span class="env-value correct">{{ envConfig.baseUrl }}</span>
          <span class="env-desc">部署基礎路徑（預設 /）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.PROD</span>
          <span class="env-value" :class="envConfig.isProd ? 'warn' : 'correct'">
            {{ envConfig.isProd }}
          </span>
          <span class="env-desc">是否為生產環境（build 後才是 true）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.DEV</span>
          <span class="env-value" :class="envConfig.isDev ? 'correct' : 'warn'">
            {{ envConfig.isDev }}
          </span>
          <span class="env-desc">是否為開發環境（dev server 時為 true）</span>
        </div>
        <div class="env-row">
          <span class="env-key">import.meta.env.VITE_API_URL</span>
          <span class="env-value muted">{{ envConfig.apiUrl }}</span>
          <span class="env-desc">自訂變數（需在 .env 定義）</span>
        </div>
      </div>
    </section>

    <!-- 解答說明 -->
    <section class="demo-section">
      <h4>✅ 完整填空解答</h4>
      <pre v-pre class="code-block">const envConfig = {
  // TODO 1 → MODE（當前模式字串）
  mode: import.meta.env.MODE,

  // TODO 2 → BASE_URL（部署路徑）
  baseUrl: import.meta.env.BASE_URL,

  // TODO 3 → PROD（boolean，production 時 true）
  isProd: import.meta.env.PROD,

  // TODO 4 → DEV（boolean，development 時 true）
  isDev: import.meta.env.DEV,

  // TODO 5 → VITE_API_URL（自訂，需有 VITE_ 前綴）
  apiUrl: import.meta.env.VITE_API_URL ?? '未設定',
}</pre>
    </section>

    <!-- 安全性說明 -->
    <section class="demo-section">
      <h4>⚠️ 安全性重點：VITE_ 前綴限制</h4>
      <pre v-pre class="code-block"># .env — 只有 VITE_ 前綴的變數才會暴露給瀏覽器
VITE_API_URL=https://api.example.com  ← ✅ 瀏覽器可讀取
DB_PASSWORD=secret123                 ← ❌ 不會暴露（保護敏感資訊）

# 程式碼中讀取
import.meta.env.VITE_API_URL  → 'https://api.example.com'
import.meta.env.DB_PASSWORD   → undefined（安全）

# 實際應用：根據環境切換 API 端點
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const axios = create({ baseURL: API_BASE })</pre>
    </section>
  </div>
</template>

<style scoped>
.env-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.env-grid { display: flex; flex-direction: column; gap: 8px; }
.env-row { display: grid; grid-template-columns: 260px 180px 1fr; align-items: center; gap: var(--space-sm); padding: 6px 8px; background: var(--color-bg); border-radius: var(--radius-sm); font-size: var(--font-size-sm); }
.env-key { font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-primary); }
.env-value { font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; padding: 2px 8px; border-radius: 4px; background: var(--color-border); }
.env-value.correct { background: #dcfce7; color: #16a34a; }
.env-value.warn    { background: #fef3c7; color: #92400e; }
.env-value.muted   { color: var(--color-text-muted); font-size: 0.75rem; }
.env-desc { font-size: 0.75rem; color: var(--color-text-muted); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
