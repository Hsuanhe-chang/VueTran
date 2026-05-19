<script setup lang="ts">
/** Q08 — 路由查詢字串（Query Parameters）（從零撰寫）
 *
 *  Query params 特性：
 *  - 不需在路由設定中宣告（與 params 動態段不同）
 *  - 任何路由都可攜帶任意 query params
 *  - 值型別永遠是字串（或字串陣列）
 *  - URL 結構：/path?key1=val1&key2=val2
 *
 *  使用情境：搜尋篩選、分頁、排序 — 這些狀態需要可分享（在 URL 中可見）
 */
import { computed /* TODO：需要 useRoute, useRouter */ } from 'vue'

// TODO 1：取得 route 和 router 實例
// const route  = useRoute()
// const router = useRouter()

// ── 商品資料 ──────────────────────────────────────────────────
const products = [
  { id: 1, name: 'Vue 3 完全指南（書）',    category: 'book',    rating: 4.8, price: 480 },
  { id: 2, name: 'React vs Vue 課程',       category: 'course',  rating: 4.5, price: 1200 },
  { id: 3, name: 'TypeScript 深度解析（書）', category: 'book',   rating: 4.6, price: 580 },
  { id: 4, name: 'Pinia 狀態管理課程',      category: 'course',  rating: 4.9, price: 899 },
  { id: 5, name: 'Node.js 後端開發（書）',   category: 'book',   rating: 4.3, price: 420 },
  { id: 6, name: 'Vite 建置工具教學',       category: 'course',  rating: 4.7, price: 650 },
]

const categories = ['all', 'book', 'course']
const sortOptions = [
  { value: 'default', label: '預設排序' },
  { value: 'rating',  label: '評分由高到低' },
  { value: 'price',   label: '價格由低到高' },
]

// ── TODO 2：從 route.query 讀取篩選狀態 ──────────────────────
// 提示：route.query.q ?? '' — 若 query 不存在則 fallback 為空字串
const searchQuery = computed(() => '' /* route.query.q ?? '' */)
const category    = computed(() => 'all' /* route.query.category ?? 'all' */)
const sortBy      = computed(() => 'default' /* route.query.sort ?? 'default' */)

// ── TODO 3：更新 query params 的函式 ─────────────────────────
// 提示：router.replace({ query: { ...route.query, q: val } })
function setSearch(val: string): void {
  // TODO：用 router.replace 更新 query，保留其他 query params
  console.log('setSearch:', val, '（尚未實作）')
}

function setCategory(val: string): void {
  // TODO：用 router.replace 更新 category query param
  console.log('setCategory:', val, '（尚未實作）')
}

function setSort(val: string): void {
  // TODO：用 router.replace 更新 sort query param
  console.log('setSort:', val, '（尚未實作）')
}

// ── TODO 4：根據 query 過濾 + 排序商品 ───────────────────────
const filteredProducts = computed(() => {
  // TODO：根據 searchQuery.value、category.value、sortBy.value 篩選排序
  // 目前直接回傳全部
  return products
})
</script>

<template>
  <div class="query-params-demo">
    <h3>🔍 Q08 — 路由查詢字串（Query Parameters）（練習）</h3>

    <!-- ── 當前 URL query（TODO 完成後有值）── -->
    <section class="demo-section">
      <h4>當前 URL Query Params</h4>
      <!-- TODO：把 null 換成 route.query -->
      <div class="route-info">
        <div class="info-row"><span class="info-label">route.query</span><span class="info-value">{{ /* route.query */ null }}</span></div>
        <div class="info-row"><span class="info-label">route.fullPath</span><span class="info-value">{{ /* route.fullPath */ '（尚未實作）' }}</span></div>
      </div>
    </section>

    <!-- ── 搜尋與篩選 UI ── -->
    <section class="demo-section">
      <h4>商品搜尋（操作後觀察 URL 變化）</h4>

      <!-- 搜尋框 -->
      <input
        :value="searchQuery"
        @input="setSearch(($event.target as HTMLInputElement).value)"
        type="text"
        class="search-input"
        placeholder="搜尋商品名稱…"
      />

      <!-- 分類 Tab -->
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: category === cat }"
          @click="setCategory(cat)"
        >
          {{ cat === 'all' ? '全部' : cat === 'book' ? '書籍' : '課程' }}
        </button>
      </div>

      <!-- 排序 -->
      <div class="sort-row">
        <label>排序：</label>
        <select :value="sortBy" @change="setSort(($event.target as HTMLSelectElement).value)" class="sort-select">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>
    </section>

    <!-- ── 商品列表 ── -->
    <section class="demo-section">
      <h4>商品列表（{{ filteredProducts.length }} / {{ products.length }} 件）</h4>
      <div class="product-list">
        <div v-for="p in filteredProducts" :key="p.id" class="product-card">
          <div class="product-info">
            <p class="product-name">{{ p.name }}</p>
            <span class="product-cat">{{ p.category }}</span>
          </div>
          <div class="product-meta">
            <span class="product-rating">⭐ {{ p.rating }}</span>
            <span class="product-price">NT$ {{ p.price }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.query-params-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.route-info { display: flex; flex-direction: column; gap: 6px; }
.info-row { display: flex; gap: var(--space-sm); font-size: var(--font-size-sm); }
.info-label { font-family: var(--font-mono); color: var(--color-text-muted); min-width: 120px; }
.info-value { font-family: var(--font-mono); color: var(--color-primary); word-break: break-all; }
.search-input { width: 100%; padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; background: var(--color-bg); color: var(--color-text); outline: none; box-sizing: border-box; }
.search-input:focus { border-color: var(--color-primary); }
.category-tabs { display: flex; gap: 6px; }
.cat-btn { padding: 6px 18px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); font-weight: 500; }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.sort-row { display: flex; align-items: center; gap: var(--space-sm); font-size: var(--font-size-sm); }
.sort-select { padding: 6px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.product-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.product-card { display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm) var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.product-info { display: flex; align-items: center; gap: var(--space-sm); }
.product-name { font-weight: 500; font-size: var(--font-size-sm); margin: 0; }
.product-cat { font-size: 0.7rem; padding: 2px 8px; background: var(--color-border); border-radius: 999px; color: var(--color-text-muted); }
.product-meta { display: flex; gap: var(--space-sm); align-items: center; font-size: var(--font-size-sm); }
.product-rating { color: #f59e0b; }
.product-price { font-weight: 600; color: var(--color-primary); font-family: var(--font-mono); }
</style>
