<script setup>
/** Q06 — shallowRef / shallowReactive 效能優化（解答）
 *
 *  Bug A 修正：shallowRef(0) → ref(0)（基本型別用 ref，語義更清晰）
 *  Bug B 修正：直接改巢狀屬性 → 整個替換 .value（方案 1）
 *              或在修改後呼叫 triggerRef()（方案 2，在 increaseFontSize 展示）
 *  Bug C 修正：ref([...]) → shallowRef([...])（整個替換策略省去深層追蹤）
 */
import { ref, shallowRef, triggerRef } from 'vue'

// ═══════════════════════════════════════════════════════
// Demo A — 計數器（基本型別）
// ═══════════════════════════════════════════════════════

// ✅ Bug A 修正：基本型別（number）使用 ref() 即可，不需要 shallowRef()
// shallowRef 與 ref 對基本型別行為相同，但 ref 更符合慣例
const counter = ref(0)

function increment() { counter.value++ }

// ═══════════════════════════════════════════════════════
// Demo B — 設定物件（shallowRef + 巢狀屬性）
// ═══════════════════════════════════════════════════════

const settings = shallowRef({
  theme: 'dark',
  fontSize: 16,
  language: 'zh-TW'
})

function toggleTheme() {
  // ✅ Bug B 修正（方案 1）：整個替換 .value → shallowRef 偵測到變化，觸發更新
  const newTheme = settings.value.theme === 'dark' ? 'light' : 'dark'
  settings.value = { ...settings.value, theme: newTheme }
}

function increaseFontSize() {
  // ✅ Bug B 修正（方案 2）：修改後呼叫 triggerRef() 強制更新
  // 適合不想每次都建立新物件的場景
  settings.value.fontSize += 2
  triggerRef(settings)  // 通知 Vue：settings.value 的內容已改變，請重新渲染
}

// ═══════════════════════════════════════════════════════
// Demo C — 大型商品列表（整個替換策略）
// ═══════════════════════════════════════════════════════

function generateProducts(page) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: page * 100 + i,
    name: `商品 ${page}-${String(i + 1).padStart(3, '0')}`,
    price: Math.floor(Math.random() * 500) + 100,
    stock: Math.floor(Math.random() * 50),
    meta: { tags: ['tag-a', 'tag-b'], rating: 4.5, reviews: 128 }
  }))
}

// ✅ Bug C 修正：改用 shallowRef()
// 因為每次 loadNextPage 都整個替換陣列，shallowRef 能偵測到 .value 替換
// 同時省去了對 20 個商品物件（含 meta 子物件）的深層追蹤開銷
const products = shallowRef(generateProducts(1))
let currentPage = 1

function loadNextPage() {
  currentPage++
  // 整個替換 → shallowRef 能偵測，視圖更新；且不需要深層追蹤新陣列的內容
  products.value = generateProducts(currentPage)
}
</script>

<template>
  <div class="shallow-demo">
    <h3>⚡ Q06 — shallowRef 效能優化（解答）</h3>

    <!-- ── Demo A ── -->
    <section class="demo-section">
      <h4>Demo A — 計數器（✅ Bug A 修正：ref 取代 shallowRef）</h4>
      <div class="row">
        <button class="btn btn-sm" @click="increment">＋ 計數</button>
        <span class="value-display">計數：{{ counter }}</span>
      </div>
      <p class="fix-hint">✅ <code>const counter = ref(0)</code>（基本型別用 ref，語義正確）</p>
    </section>

    <!-- ── Demo B ── -->
    <section class="demo-section">
      <h4>Demo B — 設定物件（✅ Bug B 修正）</h4>
      <div class="settings-display">
        <span>主題：<strong>{{ settings.theme }}</strong></span>
        <span>字型大小：<strong>{{ settings.fontSize }}px</strong></span>
        <span>語言：<strong>{{ settings.language }}</strong></span>
      </div>
      <div class="row">
        <button class="btn btn-sm" @click="toggleTheme">切換主題（方案 1：整個替換）</button>
        <button class="btn btn-sm btn-outline" @click="increaseFontSize">字型 ＋2（方案 2：triggerRef）</button>
      </div>
      <pre class="code-block-sm">// 方案 1：整個替換 .value（推薦）
settings.value = { ...settings.value, theme: newTheme }

// 方案 2：改完後呼叫 triggerRef
settings.value.fontSize += 2
triggerRef(settings)</pre>
    </section>

    <!-- ── Demo C ── -->
    <section class="demo-section">
      <h4>Demo C — 商品列表（✅ Bug C 修正：shallowRef 取代 ref）</h4>
      <div class="row">
        <button class="btn btn-sm" @click="loadNextPage">載入下一頁</button>
        <span class="value-display">顯示 {{ products.length }} 筆商品（第 {{ currentPage }} 頁）</span>
      </div>
      <ul class="product-list">
        <li v-for="p in products.slice(0, 5)" :key="p.id" class="product-item">
          {{ p.name }} — ${{ p.price }}
        </li>
        <li class="product-item muted">…（共 {{ products.length }} 筆）</li>
      </ul>
      <p class="fix-hint">✅ <code>const products = shallowRef([...])</code>（整個替換策略，省去深層追蹤）</p>
    </section>

    <!-- ── 完整說明 ── -->
    <section class="demo-section">
      <h4>✅ Bug 修正對照</h4>
      <pre v-pre class="code-block">// Bug A 修正：基本型別用 ref()，不是 shallowRef()
const counter = ref(0)   // ✅

// Bug B 修正（方案 1）：整個替換 .value
settings.value = { ...settings.value, theme: newTheme }  // ✅

// Bug B 修正（方案 2）：修改後呼叫 triggerRef
settings.value.fontSize += 2
triggerRef(settings)     // ✅ 強制通知 Vue 重新渲染

// Bug C 修正：整個替換策略 → 用 shallowRef
const products = shallowRef(generateProducts(1))  // ✅
products.value = generateProducts(nextPage)        // ✅ 整個替換觸發更新</pre>
    </section>
  </div>
</template>

<style scoped>
.shallow-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.fix-hint { font-size: var(--font-size-sm); color: #16a34a; background: rgba(22,163,74,0.08); padding: 6px 10px; border-radius: var(--radius-sm); border-left: 3px solid #16a34a; }
.row { display: flex; align-items: center; gap: var(--space-md); flex-wrap: wrap; }
.value-display { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary); }
.settings-display { display: flex; gap: var(--space-lg); font-size: var(--font-size-sm); flex-wrap: wrap; }
.product-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.product-item { font-size: var(--font-size-sm); padding: 4px 0; border-bottom: 1px dashed var(--color-border); }
.product-item.muted { color: var(--color-text-muted); border-bottom: none; }
code { background: var(--color-border); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 5px 14px; font-size: 0.85rem; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
.code-block-sm { background: #1e293b; color: #e2e8f0; padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.8rem; white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
