<script setup>
/** Q02 — 響應式參數傳遞（toValue / MaybeRef）（從零撰寫）
 *
 *  問題：Composable 的參數可能是：
 *    1. 純值（number）     → useFormatPrice(299)
 *    2. ref（Ref<number>） → useFormatPrice(ref(299))
 *    3. getter 函式        → useFormatPrice(() => product.price)
 *
 *  用 toValue() 一律統一取值，不需手動 if/else 判斷類型。
 */
import { ref, computed, toValue } from 'vue'

// ── TODO：實作 useFormatPrice composable ──────────────────────
// 接受 source（值 | ref | getter）和 currency（預設 'TWD'）
// 回傳一個 computed string：格式化後的貨幣字串
//
// 提示：
// function useFormatPrice(source, currency = 'TWD') {
//   return computed(() => {
//     const price = toValue(source)  // 統一取得當前數值
//     return new Intl.NumberFormat('zh-TW', {
//       style:    'currency',
//       currency: currency,
//       minimumFractionDigits: 0,
//     }).format(price)
//   })
// }

function useFormatPrice(source, currency = 'TWD') {
  // 請實作這裡
  return computed(() => '（尚未實作）')
}

// ── 三種呼叫方式（完成 composable 後應全部正確顯示）──────────

// 方式 1：純值（靜態，不會因外部改變而更新）
const price1 = useFormatPrice(299)

// 方式 2：ref（動態，ref 改變時自動更新）
const basePrice = ref(599)
const price2    = useFormatPrice(basePrice)

// 方式 3：getter 函式（動態，getter 的依賴改變時自動更新）
const discount   = ref(0.8)
const salePrice  = useFormatPrice(() => Math.round(basePrice.value * discount.value))
</script>

<template>
  <div class="to-value-demo">
    <h3>🔄 Q02 — toValue / MaybeRef 練習</h3>

    <!-- ── 三種使用方式展示 ── -->
    <section class="demo-section">
      <h4>useFormatPrice 三種傳入方式</h4>

      <div class="price-cards">
        <div class="price-card">
          <p class="card-label">方式 1：純值 <code>useFormatPrice(299)</code></p>
          <p class="price-value">{{ price1 }}</p>
          <p class="hint">靜態值，不會響應外部變化</p>
        </div>

        <div class="price-card">
          <p class="card-label">方式 2：ref <code>useFormatPrice(basePrice)</code></p>
          <p class="price-value">{{ price2 }}</p>
          <div class="control-row">
            <label>調整 basePrice：</label>
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
  </div>
</template>

<style scoped>
.to-value-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price-cards { display: flex; flex-direction: column; gap: var(--space-md); }
.price-card { padding: var(--space-md); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-xs, 6px); }
.card-label { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.price-value { font-size: 1.8rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-mono); }
.control-row { display: flex; align-items: center; gap: var(--space-sm); flex-wrap: wrap; font-size: var(--font-size-sm); }
.control-row input[type="range"] { flex: 1; min-width: 120px; }
</style>
