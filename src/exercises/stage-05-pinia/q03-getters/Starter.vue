<script setup>
/** Q03 — Getters 與衍生狀態（從零撰寫）
 *
 *  Pinia Getters 是 Store 的計算屬性：
 *  - Options Store：第一個參數是 state
 *  - Setup Store  ：用 computed()
 *  - 帶參數的 Getter：回傳一個函式（getter 本身是 computed，回傳的函式才接受參數）
 */
import { defineStore } from 'pinia'

// ── 商品資料 ──────────────────────────────────────────────────────
const useProductStore = defineStore('products-q03', {
  state: () => ({
    // 商品清單
    products: [
      { id: '1', name: 'Vue 3 入門書',         category: '書籍',   price: 580,  rating: 4.8 },
      { id: '2', name: 'TypeScript 完全指南',   category: '書籍',   price: 650,  rating: 4.5 },
      { id: '3', name: '機械鍵盤',               category: '3C',     price: 2800, rating: 4.6 },
      { id: '4', name: '27 吋顯示器',           category: '3C',     price: 8500, rating: 4.7 },
      { id: '5', name: '人體工學椅',             category: '家具',   price: 12000, rating: 4.9 },
      { id: '6', name: '站立辦公桌',             category: '家具',   price: 15000, rating: 4.3 },
    ],

    // 當前選擇的分類篩選器
    category: 'all',
  }),

  getters: {
    // ── TODO 1：totalProducts — 商品總數 ──────────────────────────
    // 提示：state.products.length
    totalProducts: /* TODO */ null,

    // ── TODO 2：filteredProducts — 依 category 過濾 ───────────────
    // 提示：category 為 'all' 時回傳全部，否則篩選 p.category === state.category
    filteredProducts: /* TODO */ null,

    // ── TODO 3：averageRating — 所有商品評分平均 ──────────────────
    // 提示：無商品時回傳 0；用 reduce 累加後除以長度
    averageRating: /* TODO */ null,

    // ── TODO 4：getById — 帶參數的 Getter（回傳函式）──────────────
    // 用法：store.getById('3') → 找到 id 為 '3' 的商品
    // 提示：return (id) => state.products.find(p => p.id === id)
    getById: /* TODO */ null,
  },

  actions: {
    // 切換分類（已完成）
    setCategory(cat) { this.category = cat },
  },
})

const store = useProductStore()

// ── 測試 getById ──────────────────────────────────────────────────
// getById 是一個回傳函式的 getter，呼叫方式：store.getById('id')
</script>

<template>
  <div class="getters-demo">
    <h3>🍍 Q03 — Getters 與衍生狀態（練習）</h3>

    <!-- ── Getter 數值展示 ── -->
    <section class="demo-section">
      <h4>Getter 計算結果</h4>
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">totalProducts</p>
          <p class="stat-value">{{ store.totalProducts ?? '尚未實作' }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">averageRating</p>
          <p class="stat-value">{{ store.averageRating != null ? store.averageRating.toFixed(2) : '尚未實作' }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">getById('3')</p>
          <p class="stat-value">{{ store.getById?.('3')?.name ?? '尚未實作' }}</p>
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
        </button>
      </div>

      <div v-if="store.filteredProducts" class="product-list">
        <div v-for="p in store.filteredProducts" :key="p.id" class="product-row">
          <span class="product-name">{{ p.name }}</span>
          <span class="product-cat">{{ p.category }}</span>
          <span class="product-rating">★ {{ p.rating }}</span>
          <span class="product-price">NT$ {{ p.price.toLocaleString() }}</span>
        </div>
      </div>
      <p v-else class="hint">完成 TODO 2 後商品列表會顯示</p>
    </section>
  </div>
</template>

<style scoped>
.getters-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-sm); }
.stat-card { padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); text-align: center; }
.stat-label { font-size: 0.75rem; color: var(--color-text-muted); font-family: var(--font-mono); margin-bottom: 4px; }
.stat-value { font-size: 1.1rem; font-weight: 700; color: var(--color-primary); }
.category-btns { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.product-list { display: flex; flex-direction: column; gap: 6px; }
.product-row { display: flex; align-items: center; gap: var(--space-sm); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.product-name { flex: 1; font-weight: 500; }
.product-cat { padding: 2px 8px; background: var(--color-border); border-radius: 999px; font-size: 0.75rem; color: var(--color-text-muted); }
.product-rating { color: #f59e0b; font-weight: 600; min-width: 60px; }
.product-price { font-family: var(--font-mono); color: var(--color-primary); min-width: 100px; text-align: right; }
</style>
