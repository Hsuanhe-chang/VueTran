<script setup lang="ts">
/**
 * Q03 — Computed Properties 計算屬性
 * 任務：讓購物車的總價、總數量、空狀態能自動計算
 *
 * 現況：商品列表已建立，increaseQty / decreaseQty 也已完成。
 * 你需要用 computed() 建立三個衍生狀態。
 */
import { ref, computed } from 'vue'

// ✅ 商品列表已建立
const products = ref([
  { name: 'Vue 3 教學書', price: 980, qty: 1 },
  { name: 'Vite 開發指南', price: 650, qty: 2 },
  { name: 'Pinia 狀態管理', price: 420, qty: 3 },
])

// TODO 1: 建立 totalPrice（computed）
//         = 所有商品的 price × qty 的總和
//         提示：products.value.reduce((sum, p) => sum + p.price * p.qty, 0)
const totalPrice = computed(() => {
  // 請在此填入計算邏輯
  return 0  // ← 改為正確的計算
})

// TODO 2: 建立 totalItems（computed）
//         = 所有商品的 qty 總和
const totalItems = computed(() => {
  // 請在此填入計算邏輯
  return 0  // ← 改為正確的計算
})

// TODO 3: 建立 isCartEmpty（computed）
//         = 當所有商品 qty 都為 0 時回傳 true
const isCartEmpty = computed(() => {
  // 請在此填入計算邏輯
  return false  // ← 改為正確的判斷
})

// ✅ 已完成的函式
function increaseQty(index: number): void {
  products.value[index].qty++
}

function decreaseQty(index: number): void {
  if (products.value[index].qty > 0) {
    products.value[index].qty--
  }
}
</script>

<template>
  <div class="cart-demo">
    <h3>🛒 購物車計算屬性練習</h3>

    <!-- isCartEmpty 由你的 computed 控制，目前永遠是 false，試著讓它正確運作 -->
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

    <!-- totalItems 和 totalPrice 目前都是 0，完成 computed 後會自動更新 -->
    <div class="cart-summary">
      <p>商品總件數：<strong>{{ totalItems }}</strong> 件</p>
      <p>商品總金額：<strong>NT$ {{ totalPrice }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.cart-demo { padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h3 { margin-bottom: var(--space-lg); }
.empty-msg { text-align: center; color: var(--color-text-muted); padding: var(--space-lg); background: rgba(0,0,0,0.03); border-radius: var(--radius-md); margin-bottom: var(--space-md); }
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
