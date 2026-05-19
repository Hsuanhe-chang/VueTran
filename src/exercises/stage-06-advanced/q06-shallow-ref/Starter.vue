<script setup lang="ts">
/** Q06 — shallowRef / shallowReactive 效能優化（找錯誤 + 重構）
 *
 *  深層 ref() 會遞迴追蹤所有巢狀屬性，對大型物件造成效能開銷。
 *  shallowRef() 只追蹤 .value 本身（不追蹤內部屬性）。
 *
 *  本題有 3 個 Bug，請找出並修正：
 *
 *  Bug A（第 26 行）：對基本型別（number）使用 shallowRef
 *    → shallowRef(0) 可運作，但語義上多餘；基本型別應用 ref()
 *
 *  Bug B（第 55 行）：直接修改 shallowRef 巢狀屬性，不觸發更新
 *    → 需改為「整個替換 .value」或呼叫 triggerRef(settings)
 *
 *  Bug C（第 68 行）：對「整個替換」的大型列表用了 ref()（效能浪費）
 *    → 每次替換整個陣列，深層追蹤毫無意義，應改為 shallowRef()
 */
import { ref, shallowRef, triggerRef } from 'vue'

// ═══════════════════════════════════════════════════════
// Demo A — 計數器（基本型別）
// ═══════════════════════════════════════════════════════

// ❌ Bug A：shallowRef 用於基本型別（number 沒有巢狀屬性可追蹤）
// 功能雖正常，但語義錯誤；基本型別請直接用 ref()
const counter = shallowRef(0)

function increment() { counter.value++ }

// ═══════════════════════════════════════════════════════
// Demo B — 設定物件（shallowRef + 巢狀屬性）
// ═══════════════════════════════════════════════════════

// shallowRef 對物件只追蹤「.value 本身」是否被替換
// 直接修改 .value 內部屬性，Vue 不會感知到變化
const settings = shallowRef({
  theme: 'dark',
  fontSize: 16,
  language: 'zh-TW'
})

function toggleTheme() {
  // ❌ Bug B：直接改巢狀屬性 → shallowRef 不追蹤，視圖不更新！
  settings.value.theme = settings.value.theme === 'dark' ? 'light' : 'dark'
  // 修正方案 1：整個替換 .value
  // settings.value = { ...settings.value, theme: newTheme }
  //
  // 修正方案 2：強制觸發更新
  // settings.value.theme = newTheme
  // triggerRef(settings)
}

function increaseFontSize() {
  // ❌ Bug B（同樣問題）：直接改巢狀屬性
  settings.value.fontSize += 2
}

// ═══════════════════════════════════════════════════════
// Demo C — 大型商品列表（整個替換策略）
// ═══════════════════════════════════════════════════════

// 模擬從 API 取回的商品列表（實際可能有數百筆）
function generateProducts(page: number) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: page * 100 + i,
    name: `商品 ${page}-${String(i + 1).padStart(3, '0')}`,
    price: Math.floor(Math.random() * 500) + 100,
    stock: Math.floor(Math.random() * 50),
    // 模擬深層物件（ref 會遞迴追蹤這些屬性，shallowRef 不會）
    meta: { tags: ['tag-a', 'tag-b'], rating: 4.5, reviews: 128 }
  }))
}

// ❌ Bug C：對「整個替換」的大型列表使用 ref()
// ref() 會深層追蹤每個商品物件的每個屬性（包含 meta 內部）
// 但我們每次都整個替換陣列，深層追蹤完全沒有用到，純屬浪費
const products = ref(generateProducts(1))
let currentPage = 1

function loadNextPage() {
  currentPage++
  // 整個替換策略：直接賦值新陣列（ref 或 shallowRef 都能觸發更新）
  // 但 shallowRef 省去了對新陣列內所有物件的深層追蹤開銷
  products.value = generateProducts(currentPage)
}
</script>

<template>
  <div class="shallow-demo">
    <h3>⚡ Q06 — shallowRef 效能優化（找錯誤）</h3>
    <p class="hint">此檔案有 3 個 Bug（A / B / C），請找出並修正</p>

    <!-- ── Demo A：計數器 ── -->
    <section class="demo-section">
      <h4>Demo A — 計數器（Bug A：shallowRef 用於基本型別）</h4>
      <div class="row">
        <button class="btn btn-sm" @click="increment">＋ 計數</button>
        <span class="value-display">計數：{{ counter }}</span>
      </div>
      <p class="bug-hint">⚠️ Bug A（第 26 行）：基本型別應使用 <code>ref()</code> 而非 <code>shallowRef()</code></p>
    </section>

    <!-- ── Demo B：設定物件 ── -->
    <section class="demo-section">
      <h4>Demo B — 設定物件（Bug B：直接改巢狀屬性不觸發更新）</h4>
      <div class="settings-display">
        <span>主題：<strong>{{ settings.theme }}</strong></span>
        <span>字型大小：<strong>{{ settings.fontSize }}px</strong></span>
        <span>語言：<strong>{{ settings.language }}</strong></span>
      </div>
      <div class="row">
        <button class="btn btn-sm" @click="toggleTheme">切換主題</button>
        <button class="btn btn-sm btn-outline" @click="increaseFontSize">字型 ＋2</button>
      </div>
      <p class="bug-hint">⚠️ Bug B（第 55、61 行）：直接修改 shallowRef 巢狀屬性 → 視圖不更新</p>
    </section>

    <!-- ── Demo C：大型列表 ── -->
    <section class="demo-section">
      <h4>Demo C — 商品列表（Bug C：整個替換應用 shallowRef）</h4>
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
      <p class="bug-hint">⚠️ Bug C（第 68 行）：整個替換策略 → 改用 <code>shallowRef()</code> 更高效</p>
    </section>

    <!-- 說明表格 -->
    <section class="demo-section">
      <h4>shallowRef vs ref 比較</h4>
      <pre v-pre class="code-block">// ref()：深層追蹤（適合小型物件、基本型別）
const count = ref(0)              // ✅ 基本型別
const user  = ref({ name: 'A' }) // ✅ 小型物件，直接改屬性即觸發更新

// shallowRef()：僅追蹤 .value 本身（適合大型物件、整個替換）
const bigList = shallowRef([...]) // ✅ 大型列表，整個替換

// ❌ shallowRef 陷阱：直接改巢狀屬性，視圖不更新
bigList.value[0].name = 'B'       // 視圖不更新！

// ✅ 修正方案 1：整個替換 .value
bigList.value = [...newList]

// ✅ 修正方案 2：強制觸發
bigList.value[0].name = 'B'
triggerRef(bigList)               // 強制視圖更新</pre>
    </section>
  </div>
</template>

<style scoped>
.shallow-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.bug-hint { font-size: var(--font-size-sm); color: #f59e0b; background: rgba(245,158,11,0.08); padding: 6px 10px; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b; }
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
</style>
