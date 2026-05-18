<script setup>
/**
 * Q03 — 參考答案：Computed Properties 計算屬性
 *
 * 核心重點：
 *   1. computed() 的值會自動快取，只有依賴改變才重新計算
 *   2. computed 在 template 中像屬性使用，不加 ()
 *   3. computed 應為純函式（只讀依賴，不修改資料）
 */
import { ref, computed } from 'vue'

// 商品列表：用 ref 因為整個陣列可能被取代（雖然這裡不取代）
const products = ref([
  { name: 'Vue 3 教學書', price: 980, qty: 1 },
  { name: 'Vite 開發指南', price: 650, qty: 2 },
  { name: 'Pinia 狀態管理', price: 420, qty: 3 },
])

// totalPrice：所有商品小計加總
// reduce 從初始值 0 開始，逐一累加每個商品的 price × qty
const totalPrice = computed(() =>
  products.value.reduce((sum, p) => sum + p.price * p.qty, 0),
)

// totalItems：所有商品數量加總
const totalItems = computed(() =>
  products.value.reduce((sum, p) => sum + p.qty, 0),
)

// isCartEmpty：當所有商品 qty 都為 0 時才為 true
// every() 檢查陣列中每個元素是否滿足條件
const isCartEmpty = computed(() => products.value.every((p) => p.qty === 0))

// 增加指定商品的數量
function increaseQty(index) {
  products.value[index].qty++
}

// 減少指定商品的數量，最低為 0
function decreaseQty(index) {
  if (products.value[index].qty > 0) {
    products.value[index].qty--
  }
}
</script>

<template>
  <div class="cart-demo answer">
    <h3>🛒 購物車練習（參考答案）</h3>

    <!-- isCartEmpty 為 computed，在 template 中像屬性一樣用（不加 ()） -->
    <p v-if="isCartEmpty" class="empty-msg">🛒 購物車是空的，請加入商品數量</p>

    <ul class="product-list">
      <li v-for="(product, index) in products" :key="index" class="product-item">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">NT$ {{ product.price }}</span>

        <div class="qty-control">
          <button class="btn btn-outline" @click="decreaseQty(index)">－</button>
          <span class="qty-display">{{ product.qty }}</span>
          <button class="btn btn-outline" @click="increaseQty(index)">＋</button>
        </div>

        <span class="subtotal">= NT$ {{ product.price * product.qty }}</span>
      </li>
    </ul>

    <div class="cart-summary">
      <!-- totalItems 和 totalPrice 都是 computed，不需要加 () -->
      <p>商品總件數：<strong>{{ totalItems }}</strong> 件</p>
      <p>商品總金額：<strong>NT$ {{ totalPrice }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.cart-demo {
  padding: var(--space-lg);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-primary);
}

h3 { margin-bottom: var(--space-lg); }

.empty-msg {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-lg);
  background: rgba(0,0,0,0.03);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
}

.product-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-sm); margin-bottom: var(--space-lg); }
.product-item { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-sm) var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.product-name { flex: 1; font-weight: 500; }
.product-price { color: var(--color-text-muted); font-family: var(--font-mono); min-width: 80px; }
.qty-control { display: flex; align-items: center; gap: var(--space-sm); }
.qty-display { font-family: var(--font-mono); font-size: 1.1rem; min-width: 2ch; text-align: center; }
.subtotal { font-family: var(--font-mono); font-weight: 600; color: var(--color-primary); min-width: 90px; }
.cart-summary { padding: var(--space-md); background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-align: right; font-size: var(--font-size-lg); line-height: 2; }
.cart-summary strong { color: var(--color-primary); font-family: var(--font-mono); }
</style>
