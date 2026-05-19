<script setup lang="ts">
/** Q06 — Provide / Inject 依賴注入（解答）
 *
 *  核心概念：
 *  - provide(key, value)：在父層提供資料，所有後代元件皆可 inject
 *  - inject(key, default)：在子/孫層取得資料，key 必須與 provide 的 key 完全一致
 *  - value 應傳入 ref（響應式），而非 ref.value（靜態快照）
 *  - 用途：避免 prop drilling（跨多層傳遞 props），適合主題、語系、使用者資訊等全域資料
 */
import { ref, provide } from 'vue'
import ThemedCard from './_ThemedCard.vue'

const currentTheme = ref('light')

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

// ── Part A 解答 ────────────────────────────────────────────
// 傳入 ref 本身（非 .value），確保子層取得的是響應式資料
provide('theme', currentTheme)

// 提供 toggleTheme 函式，子層可直接呼叫來切換主題
provide('toggleTheme', toggleTheme)
</script>

<template>
  <div class="provide-demo">
    <h3>🎨 Q06 — Provide / Inject 解答</h3>

    <!-- ── Part A 展示 ── -->
    <section class="demo-section">
      <h4>Part A — 完整的 provide() 實作</h4>
      <p class="hint">ThemedCard 透過 inject('theme') 和 inject('toggleTheme') 取得資料</p>

      <!-- ThemedCard 收到 provide 後，會根據 theme 改變外觀 -->
      <ThemedCard />

      <div class="answer-block card">
        <h5>✅ 正確的 provide / inject 寫法</h5>
        <pre class="code-block">// ── 父層 ──
const currentTheme = ref('light')
provide('theme', currentTheme)       // 傳 ref，保持響應性
provide('toggleTheme', toggleTheme)  // 傳函式，子層可呼叫

// ── 子層 ──
const theme       = inject('theme', { value: 'light' })  // key 必須一致
const toggleTheme = inject('toggleTheme', null)</pre>
      </div>
    </section>

    <!-- ── Part B Bug 解析 ── -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — Bug 解析</h4>

      <div class="bug-explanation">
        <p><strong>Bug 1 — provide 傳入 .value（非響應式）：</strong></p>
        <pre class="code-block">// ❌ count.value 是當下的靜態數字（例如 0），失去響應性
provide('count', count.value)

// ✅ 傳入 ref 本身，子層的 inject 值會隨父層變化而更新
provide('count', count)</pre>
        <p class="hint">傳入 ref 本身後，inject 取得的也是 ref，子層能感知父層的變化。</p>
      </div>

      <div class="bug-explanation">
        <p><strong>Bug 2 — inject key 與 provide key 不一致（typo）：</strong></p>
        <pre class="code-block">// 父層提供：'userInfo'
provide('userInfo', userData)

// ❌ 子層 key 寫成 'user'，拿到 undefined（或 inject 的預設值）
const user = inject('user')

// ✅ key 必須完全一致
const user = inject('userInfo')</pre>
        <p class="hint">使用 Symbol 作為 key 可避免字串 typo，並在大型專案中避免命名衝突。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.provide-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.bug-section { border-color: #fca5a5; }
.answer-block { margin-top: var(--space-xs); }
.bug-explanation { display: flex; flex-direction: column; gap: 6px; padding: var(--space-sm); background: rgba(239,68,68,0.05); border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
