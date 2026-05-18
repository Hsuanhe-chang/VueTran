<script setup>
/** Q02 — 響應式參數傳遞（toValue / MaybeRef）（解答）
 *
 *  核心概念：
 *  - toValue(source) 統一處理三種輸入型別：純值、ref、getter 函式
 *  - 搭配 computed 確保來源有響應性時結果自動更新
 *  - 型別別名 MaybeRefOrGetter<T> = T | Ref<T> | (() => T)（Vue 3.3+）
 */
import { ref, computed, toValue } from 'vue'

// ── useFormatPrice composable ─────────────────────────────────
// source: MaybeRefOrGetter<number> — 可傳入數值、ref 或 getter 函式
function useFormatPrice(source, currency = 'TWD') {
  return computed(() => {
    // toValue 統一取得當前數值：
    //   toValue(299)           → 299
    //   toValue(ref(299))      → 299
    //   toValue(() => 299)     → 299
    const price = toValue(source)

    // 用 Intl.NumberFormat 格式化為本地化貨幣字串
    return new Intl.NumberFormat('zh-TW', {
      style:                'currency',
      currency:             currency,
      minimumFractionDigits: 0,
    }).format(price)
  })
}

// 方式 1：純值（靜態）
const price1 = useFormatPrice(299)

// 方式 2：ref（動態，ref 改變時 computed 自動重新計算）
const basePrice = ref(599)
const price2    = useFormatPrice(basePrice)

// 方式 3：getter（動態，getter 內的依賴改變時自動更新）
const discount  = ref(0.8)
const salePrice = useFormatPrice(() => Math.round(basePrice.value * discount.value))
</script>

<template>
  <div class="to-value-demo">
    <h3>🔄 Q02 — toValue / MaybeRef 解答</h3>

    <section class="demo-section">
      <h4>useFormatPrice 三種傳入方式</h4>

      <div class="price-cards">
        <div class="price-card">
          <p class="card-label">方式 1：純值 <code>useFormatPrice(299)</code></p>
          <p class="price-value">{{ price1 }}</p>
          <p class="hint">靜態值，不響應外部變化</p>
        </div>

        <div class="price-card">
          <p class="card-label">方式 2：ref <code>useFormatPrice(basePrice)</code></p>
          <p class="price-value">{{ price2 }}</p>
          <div class="control-row">
            <label>basePrice：</label>
            <input v-model.number="basePrice" type="range" min="100" max="2000" step="50" />
            <span>{{ basePrice }}</span>
          </div>
        </div>

        <div class="price-card">
          <p class="card-label">方式 3：getter <code>useFormatPrice(() => basePrice * discount)</code></p>
          <p class="price-value">{{ salePrice }}</p>
          <div class="control-row">
            <label>折扣：</label>
            <input v-model.number="discount" type="range" min="0.1" max="1" step="0.1" />
            <span>{{ Math.round(discount * 10) }} 折</span>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section answer-section">
      <h4>✅ toValue 完整說明</h4>
      <pre class="code-block">import { toValue, computed } from 'vue'

function useFormatPrice(source, currency = 'TWD') {
  return computed(() => {
    const price = toValue(source)  // 統一取值（值 | ref | getter）
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency', currency, minimumFractionDigits: 0
    }).format(price)
  })
}

// 三種呼叫方式都支援：
useFormatPrice(299)
useFormatPrice(ref(299))
useFormatPrice(() => product.value.price)</pre>
    </section>
  </div>
</template>

<style scoped>
.to-value-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price-cards { display: flex; flex-direction: column; gap: var(--space-md); }
.price-card { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 6px; }
.card-label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price-value { font-size: 1.8rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.control-row { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; font-size: var(--font-size-sm); }
.control-row input[type="range"] { flex: 1; min-width: 120px; }
.answer-section { border-color: var(--color-primary); }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
