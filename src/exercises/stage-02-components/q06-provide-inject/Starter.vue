<script setup>
/** Q06 — Provide / Inject 依賴注入（填空 + 找錯誤）
 *  你是父層元件，負責提供主題資料給所有子元件使用。
 *  子元件（_ThemedCard.vue）透過 inject 取得資料——無需一層層 props 傳遞。
 */
import { ref, provide } from 'vue'
import ThemedCard from './_ThemedCard.vue'

// 主題狀態（響應式 ref）
const currentTheme = ref('light')

// 切換主題的函式
function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

// ── Part A：填空 ─────────────────────────────────────────────
// TODO 1：提供 currentTheme ref 給所有子元件
//   注意：傳入 ref 本身（響應式），而非 currentTheme.value（靜態值）
//   語法：provide('theme', currentTheme)
//
// TODO 2：提供 toggleTheme 函式給所有子元件
//   語法：provide('toggleTheme', toggleTheme)
</script>

<template>
  <div class="provide-demo">
    <h3>🎨 Q06 — Provide / Inject 練習</h3>

    <!-- ── Part A：展示 ── -->
    <section class="demo-section">
      <h4>Part A — 填空：完成 provide() 呼叫</h4>
      <p class="hint">
        完成 TODO 後，ThemedCard 會透過 inject 收到 theme 並顯示正確主題。<br>
        目前 ThemedCard 因為沒有收到 provide，顯示「未偵測到父層的 provide」。
      </p>

      <!-- 子元件（透過 inject 取得 theme 和 toggleTheme） -->
      <ThemedCard />
    </section>

    <!-- ── Part B：找錯誤 ── -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — 找出 2 個 Bug</h4>

      <div class="bug-item">
        <p class="bug-label">Bug 1 — 父層：</p>
        <pre class="code-block">// 父層
const count = ref(0)
provide('count', count.value)  // ← 這裡有什麼問題？</pre>
        <p class="hint">提示：provide 的第二個參數傳入什麼，子層 inject 就拿到什麼。</p>
      </div>

      <div class="bug-item">
        <p class="bug-label">Bug 2 — 子層：</p>
        <pre class="code-block">// 父層
provide('userInfo', userData)

// 子層
const user = inject('user')  // ← 這裡有什麼問題？</pre>
        <p class="hint">提示：inject 的 key 和 provide 的 key 有什麼差異？</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.provide-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; }
.bug-section { border-color: #fca5a5; }
.bug-item { display: flex; flex-direction: column; gap: 4px; }
.bug-label { font-weight: 600; color: #ef4444; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
