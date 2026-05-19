<script setup lang="ts">
/** Q01 — defineProps 定義與型別驗證（解答）
 *
 *  核心概念：
 *  - defineProps() 宣告元件可接收的 prop 清單
 *  - type：使用 JS 建構式（String / Number / Boolean / Object / Array）
 *  - required: true → 父層未傳時 Vue 在 devtools 發警告（與 default 不可同時使用）
 *  - default：父層未傳時的備援值（物件/陣列需用函式返回：default: () => ({}) ）
 *  - Vue 3.5+ 支援解構語法：const { foo = 預設值 } = defineProps({...})
 */

// ── Part A 解答 ────────────────────────────────────────────
// 使用 Vue 3.5+ 的解構寫法，解構時的 = 等同於 default
// 注意：此練習無父層傳入 props，解構預設值會作為展示資料
const {
  product    = { name: 'Vue 3 入門課程', price: 299, description: '從零開始學習 Vue 3 Composition API' },
  isFeatured = true,
  category   = '線上課程',
  stock      = 15,
} = defineProps({
  // Object prop + required：父層必須傳入，未傳時 Vue 在 devtools 警告
  product: {
    type:     Object,
    required: true,
  },
  // Boolean prop + default：父層可選，未傳時使用 false
  isFeatured: {
    type:    Boolean,
    default: false,
  },
  // String prop + default
  category: {
    type:    String,
    default: '未分類',
  },
  // Number prop + default
  stock: {
    type:    Number,
    default: 0,
  },
})
</script>

<template>
  <div class="props-demo">
    <h3>🎒 Q01 — defineProps 解答</h3>

    <!-- ── Part A 解答展示 ── -->
    <section class="demo-section">
      <h4>Part A — 完整的 defineProps 寫法</h4>

      <!-- ProductCard 渲染（使用解構預設值作為展示資料） -->
      <div :class="['product-card', { featured: isFeatured }]">
        <div class="card-header">
          <h4 class="product-name">{{ product.name }}</h4>
          <span v-if="isFeatured" class="badge-featured">⭐ 精選商品</span>
        </div>
        <p class="description">{{ product.description }}</p>
        <div class="card-footer">
          <span class="category-tag">{{ category }}</span>
          <span class="price">NT$ {{ product.price }}</span>
          <span :class="['stock-badge', stock > 0 ? 'in-stock' : 'out-stock']">
            {{ stock > 0 ? `庫存 ${stock} 件` : '已售完' }}
          </span>
        </div>
      </div>

      <!-- 解答說明 -->
      <div class="answer-block card">
        <h5>✅ 正確的 defineProps 寫法</h5>
        <pre class="code-block">const { product, isFeatured = false, category = '未分類', stock = 0 } = defineProps({
  product:    { type: Object,  required: true },
  isFeatured: { type: Boolean, default: false },
  category:   { type: String,  default: '未分類' },
  stock:      { type: Number,  default: 0 },
})</pre>
      </div>
    </section>

    <!-- ── Part B Bug 解析 ── -->
    <section class="demo-section bug-section">
      <h4>🐛 Part B — Bug 解析</h4>

      <div class="bug-explanation">
        <p><strong>Bug 1 — type 值應為建構式，不是字串：</strong></p>
        <pre class="code-block">// ❌ 錯誤：'String' 是字串，Vue 無法用它做型別驗證
type: 'String'

// ✅ 正確：String 是 JavaScript 內建建構式
type: String</pre>
        <p class="hint">Vue 的 prop 驗證透過 instanceof 或 typeof 比對，字串無法觸發正確的驗證邏輯。</p>
      </div>

      <div class="bug-explanation">
        <p><strong>Bug 2 — required 與 default 不應同時使用：</strong></p>
        <pre class="code-block">// ❌ 矛盾：required: true 表示父層必須傳，那 default 永遠用不到
{ type: Number, required: true, default: 0 }

// ✅ 擇一使用：
{ type: Number, required: true }   // 必填，無備援值
{ type: Number, default: 0 }       // 可選，有備援值</pre>
        <p class="hint">Vue 在 devtools 會對此組合發出警告。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.props-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4, h5 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.product-card { border: 2px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-md); background: var(--color-bg); }
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
.answer-block { margin-top: var(--space-xs); }
.bug-explanation { display: flex; flex-direction: column; gap: 6px; padding: var(--space-sm); background: rgba(239,68,68,0.05); border-left: 3px solid #ef4444; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
