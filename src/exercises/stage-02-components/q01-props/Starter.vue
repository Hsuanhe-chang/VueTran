<script setup lang="ts">
/** Q01 — defineProps 定義與型別驗證（填空 + 找錯誤）
 *  你正在實作 ProductCard 子元件。
 *  父層會這樣使用它：
 *    <ProductCard
 *      :product="{ name: 'Vue 課程', price: 299, description: '...' }"
 *      :is-featured="true"
 *      category="線上課程"
 *      :stock="15"
 *    />
 */

// ── Part A：填空 ────────────────────────────────────────────
// TODO：將下方的佔位常數替換為正確的 defineProps 呼叫
//
// 需要定義的 4 個 prop：
//   product     (Object,  required: true)     → 含 name / price / description
//   isFeatured  (Boolean, default: false)      → 是否為精選商品
//   category    (String,  default: '未分類')  → 商品類別
//   stock       (Number,  default: 0)          → 庫存數量
//
// 參考語法（Vue 3.5+ 解構寫法）：
// const { product, isFeatured = false, category = '未分類', stock = 0 } = defineProps({
//   product:    { type: Object,  required: true },
//   isFeatured: { type: Boolean, default: false },
//   category:   { type: String,  default: '未分類' },
//   stock:      { type: Number,  default: 0 },
// })

// ★ 佔位常數（實作 defineProps 後請刪除這個區塊）
const product    = { name: 'Vue 3 入門課程', price: 299, description: '從零開始學習 Vue 3 Composition API' }
const isFeatured = true
const category   = '線上課程'
const stock      = 15
</script>

<template>
  <div class="props-demo">
    <h3>🎒 Q01 — defineProps 練習</h3>

    <!-- ── Part A：ProductCard 渲染 ── -->
    <section class="demo-section">
      <h4>Part A — 填空：完成 defineProps</h4>
      <p class="hint">完成 defineProps 後，這些資料將來自父層傳入的 props（目前是佔位常數）</p>

      <!-- 商品卡片，根據 isFeatured 動態切換樣式 -->
      <div :class="['product-card', { featured: isFeatured }]">
        <div class="card-header">
          <h4 class="product-name">{{ product.name }}</h4>
          <span v-if="isFeatured" class="badge-featured">⭐ 精選商品</span>
        </div>
        <p class="description">{{ product.description }}</p>
        <div class="card-footer">
          <span class="category-tag">{{ category }}</span>
          <span class="price">NT$ {{ product.price }}</span>
          <!-- 庫存為 0 時顯示「已售完」 -->
          <span :class="['stock-badge', stock > 0 ? 'in-stock' : 'out-stock']">
            {{ stock > 0 ? `庫存 ${stock} 件` : '已售完' }}
          </span>
        </div>
      </div>
    </section>

    <!-- ── Part B：找錯誤 ── -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — 找出 2 個 Bug</h4>
      <p class="hint">以下 defineProps 各有一個錯誤，請找出並說明原因：</p>

      <!-- Bug 1 -->
      <div class="bug-item">
        <p class="bug-label">Bug 1：</p>
        <pre class="code-block">defineProps({
  title: { type: 'String', required: true },
})</pre>
        <p class="hint">提示：type 的值應該是什麼型別？</p>
      </div>

      <!-- Bug 2 -->
      <div class="bug-item">
        <p class="bug-label">Bug 2：</p>
        <pre class="code-block">defineProps({
  count: { type: Number, required: true, default: 0 },
})</pre>
        <p class="hint">提示：required 與 default 同時使用有什麼問題？</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.props-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.product-card { border: 2px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md); background: var(--color-bg); transition: border-color 0.2s; }
.product-card.featured { border-color: var(--color-primary); background: rgba(66,184,131,0.05); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
.product-name { font-size: var(--font-size-lg); font-weight: 600; }
.badge-featured { background: var(--color-primary); color: white; padding: 2px 10px; border-radius: 20px; font-size: var(--font-size-sm); }
.description { color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--space-sm); }
.card-footer { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; }
.category-tag { background: var(--color-bg); border: 1px solid var(--color-border); padding: 2px 10px; border-radius: 20px; font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-primary); margin-left: auto; }
.stock-badge { font-size: var(--font-size-sm); padding: 2px 10px; border-radius: 20px; }
.in-stock { background: rgba(66,184,131,0.15); color: var(--color-primary); }
.out-stock { background: rgba(239,68,68,0.1); color: #ef4444; }
.bug-section { border-color: #fca5a5; }
.bug-item { display: flex; flex-direction: column; gap: 4px; }
.bug-label { font-weight: 600; color: #ef4444; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
