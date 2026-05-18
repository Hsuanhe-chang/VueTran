<script setup>
/** Q08 — 路由查詢字串（Query Parameters）（解答）
 *
 *  核心概念：
 *  - route.query.key 讀取 query params（值永遠是字串或 undefined）
 *  - router.replace({ query: {...} }) 更新 query（replace 不增加歷史，避免搜尋操作堆積歷史）
 *  - 用 { ...route.query, key: val } 展開保留其他 query params，只更新特定 key
 *  - computed 依賴 route.query → query 改變時自動重新計算過濾結果
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route  = useRoute()
const router = useRouter()

const products = [
  { id: 1, name: 'Vue 3 完全指南（書）',     category: 'book',   rating: 4.8, price: 480 },
  { id: 2, name: 'React vs Vue 課程',        category: 'course', rating: 4.5, price: 1200 },
  { id: 3, name: 'TypeScript 深度解析（書）', category: 'book',   rating: 4.6, price: 580 },
  { id: 4, name: 'Pinia 狀態管理課程',       category: 'course', rating: 4.9, price: 899 },
  { id: 5, name: 'Node.js 後端開發（書）',    category: 'book',   rating: 4.3, price: 420 },
  { id: 6, name: 'Vite 建置工具教學',        category: 'course', rating: 4.7, price: 650 },
]

const categories  = ['all', 'book', 'course']
const sortOptions = [
  { value: 'default', label: '預設排序' },
  { value: 'rating',  label: '評分由高到低' },
  { value: 'price',   label: '價格由低到高' },
]

// 從 route.query 讀取篩選狀態（響應式：query 改變時自動更新）
const searchQuery = computed(() => (route.query.q ?? '').toString())
const category    = computed(() => (route.query.category ?? 'all').toString())
const sortBy      = computed(() => (route.query.sort ?? 'default').toString())

// 用 router.replace 更新 query — replace 不增加歷史紀錄（避免篩選操作堆積瀏覽器歷史）
function setSearch(val) {
  router.replace({ query: { ...route.query, q: val || undefined } })
  // q: undefined 會移除該 key（不顯示在 URL 中）
}

function setCategory(val) {
  router.replace({ query: { ...route.query, category: val === 'all' ? undefined : val } })
}

function setSort(val) {
  router.replace({ query: { ...route.query, sort: val === 'default' ? undefined : val } })
}

// 根據 query 過濾 + 排序（computed 依賴 route.query，自動響應）
const filteredProducts = computed(() => {
  let list = [...products]

  // 搜尋過濾（不分大小寫）
  const q = searchQuery.value.toLowerCase().trim()
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q))

  // 分類過濾
  if (category.value !== 'all') list = list.filter(p => p.category === category.value)

  // 排序
  if (sortBy.value === 'rating') list.sort((a, b) => b.rating - a.rating)
  else if (sortBy.value === 'price') list.sort((a, b) => a.price - b.price)

  return list
})
</script>

<template>
  <div class="query-params-demo">
    <h3>🔍 Q08 — 路由查詢字串（Query Parameters）（解答）</h3>

    <!-- ── 當前 URL query ── -->
    <section class="demo-section">
      <h4>當前 URL Query Params</h4>
      <div class="route-info">
        <div class="info-row"><span class="info-label">route.query</span><span class="info-value">{{ route.query }}</span></div>
        <div class="info-row"><span class="info-label">route.fullPath</span><span class="info-value">{{ route.fullPath }}</span></div>
      </div>
    </section>

    <!-- ── 搜尋與篩選 UI ── -->
    <section class="demo-section">
      <h4>商品搜尋（操作後觀察 URL 變化）</h4>

      <input :value="searchQuery" @input="setSearch($event.target.value)"
        type="text" class="search-input" placeholder="搜尋商品名稱…" />

      <div class="category-tabs">
        <button v-for="cat in categories" :key="cat"
          class="cat-btn" :class="{ active: category === cat }"
          @click="setCategory(cat)">
          {{ cat === 'all' ? '全部' : cat === 'book' ? '書籍' : '課程' }}
        </button>
      </div>

      <div class="sort-row">
        <label>排序：</label>
        <select :value="sortBy" @change="setSort($event.target.value)" class="sort-select">
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

    <!-- ── 解答說明 ── -->
    <section class="demo-section answer-section">
      <h4>✅ Query Params 完整用法</h4>
      <pre v-pre class="code-block">// 讀取 query params（永遠是字串）
const route = useRoute()
route.query.q        // '?q=vue' → 'vue'
route.query.page     // '?page=2' → '2'（字串，非數字）

// 更新 query params（推薦 replace，避免堆積歷史）
const router = useRouter()

// 全部重設：
router.replace({ query: { q: 'vue', page: '1' } })

// 只更新部分（保留其他 params）：
router.replace({ query: { ...route.query, page: '2' } })

// 移除特定 param（設為 undefined）：
router.replace({ query: { ...route.query, q: undefined } })
// URL 中 q= 這個 key 會消失

// computed 依賴 route.query — 自動響應更新：
const filtered = computed(() =>
  products.filter(p =>
    p.name.includes(route.query.q ?? '')
  )
)</pre>
    </section>
  </div>
</template>

<style scoped>
.query-params-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.answer-section { border-color: var(--color-primary); }
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
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
