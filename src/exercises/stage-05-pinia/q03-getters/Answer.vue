<script setup>
/** Q03 — Getters 與衍生狀態（解答）
 *
 *  重點：
 *  1. 普通 Getter：(state) => 計算值
 *  2. 帶參數 Getter：(state) => (param) => 查找結果
 *     - getter 本身是 computed（不帶參），回傳的函式才接受參數
 *     - 代價：帶參 getter 的結果不會被快取（每次呼叫都重新執行）
 *  3. getter 也可以用 this 呼叫其他 getter（Options 寫法）
 */
import { defineStore } from 'pinia'

const useProductStore = defineStore('products-q03-ans', {
  state: () => ({
    products: [
      { id: '1', name: 'Vue 3 入門書',         category: '書籍',   price: 580,   rating: 4.8 },
      { id: '2', name: 'TypeScript 完全指南',   category: '書籍',   price: 650,   rating: 4.5 },
      { id: '3', name: '機械鍵盤',               category: '3C',     price: 2800,  rating: 4.6 },
      { id: '4', name: '27 吋顯示器',           category: '3C',     price: 8500,  rating: 4.7 },
      { id: '5', name: '人體工學椅',             category: '家具',   price: 12000, rating: 4.9 },
      { id: '6', name: '站立辦公桌',             category: '家具',   price: 15000, rating: 4.3 },
    ],
    category: 'all',
  }),

  getters: {
    // ① 普通 getter：直接回傳計算值
    totalProducts: (state) => state.products.length,

    // ② 篩選 getter：依 category 過濾商品
    filteredProducts: (state) =>
      state.category === 'all'
        ? state.products
        : state.products.filter(p => p.category === state.category),

    // ③ 聚合 getter：無商品時避免除以 0
    averageRating: (state) => {
      if (state.products.length === 0) return 0
      const total = state.products.reduce((sum, p) => sum + p.rating, 0)
      return total / state.products.length
    },

    // ④ 帶參數的 getter：回傳一個函式
    //    注意：這樣的 getter 無法被快取（每次都重新執行內層函式）
    getById: (state) => (id) => state.products.find(p => p.id === id),
  },

  actions: {
    setCategory(cat) { this.category = cat },
  },
})

const store = useProductStore()
</script>

<template>
  <div class="getters-demo">
    <h3>🍍 Q03 — Getters 與衍生狀態（解答）</h3>

    <!-- ── Getter 數值展示 ── -->
    <section class="demo-section">
      <h4>Getter 計算結果</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">totalProducts</p>
          <p class="stat-value">{{ store.totalProducts }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">averageRating</p>
          <p class="stat-value">{{ store.averageRating.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">getById('3')</p>
          <p class="stat-value">{{ store.getById('3')?.name }}</p>
        </div>
      </div>
    </section>

    <!-- ── 分類篩選 ── -->
    <section class="demo-section">
      <h4>filteredProducts（切換分類測試）</h4>
      <div class="category-btns">
        <button
          v-for="cat in ['all', '書籍', '3C', '家具']"
          :key="cat"
          class="cat-btn"
          :class="{ active: store.category === cat }"
          @click="store.setCategory(cat)"
        >
          {{ cat }}
          <span class="cat-count">
            {{ cat === 'all' ? store.totalProducts : store.products.filter(p => p.category === cat).length }}
          </span>
        </button>
      </div>

      <div class="product-list">
        <div v-for="p in store.filteredProducts" :key="p.id" class="product-row">
          <span class="product-name">{{ p.name }}</span>
          <span class="product-cat">{{ p.category }}</span>
          <span class="product-rating">★ {{ p.rating }}</span>
          <span class="product-price">NT$ {{ p.price.toLocaleString() }}</span>
        </div>
      </div>
    </section>

    <!-- ── 帶參數 Getter 說明 ── -->
    <section class="demo-section">
      <h4>✅ 帶參數的 Getter 寫法</h4>
      <pre v-pre class="code-block">// getters 中回傳一個函式
getters: {
  getById: (state) => (id) => state.products.find(p => p.id === id)
}

// 使用方式（注意兩個括號）
const product = store.getById('3')  // → { id: '3', name: '機械鍵盤', ... }

// ⚠️ 帶參數的 getter 無法被 Pinia 快取
// 如果需要效能優化，考慮在元件中用 computed() 包一層</pre>
    </section>
  </div>
</template>

<style scoped>
.getters-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm); }
.stat-card { padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); text-align: center; }
.stat-label { font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: 4px; }
.stat-value { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); }
.category-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn { display: flex; align-items: center; gap: 6px; padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.cat-count { font-size: 0.75rem; padding: 1px 6px; background: rgba(255,255,255,0.2); border-radius: 999px; }
.cat-btn:not(.active) .cat-count { background: var(--color-border); }
.product-list { display: flex; flex-direction: column; gap: 6px; }
.product-row { display: flex; align-items: center; gap: var(--space-sm); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.product-name { flex: 1; font-weight: 500; }
.product-cat { padding: 2px 8px; background: var(--color-border); border-radius: 999px; font-size: 0.75rem; color: var(--color-text-muted); }
.product-rating { color: #f59e0b; font-weight: 600; min-width: 60px; }
.product-price { font-family: var(--font-mono); color: var(--color-primary); min-width: 100px; text-align: right; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
