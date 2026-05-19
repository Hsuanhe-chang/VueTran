<script setup lang="ts">
/** Q99 — 綜合題：購物車（多 Store 協作）（練習）
 *
 *  整合概念：
 *  1. useProductStore  — 商品目錄（分類篩選 getter）
 *  2. useCartStore     — 購物車（數量計算 getter + 操作 action）
 *  3. useCheckoutStore — 結帳流程（表單驗證 + 訂單歷史）
 *
 *  跨 Store 互動：
 *  - useCheckoutStore.placeOrder() 呼叫 useCartStore.clear()
 *  - useCartStore.addItem() 確認商品存在於 useProductStore
 */
import { ref, computed }             from 'vue'
import { defineStore, storeToRefs }  from 'pinia'

// ── 型別定義 ────────────────────────────────────────────────────
/** 商品資料型別 */
interface Product {
  id: string
  name: string
  category: string
  price: number
}
/** 購物車品項型別 */
interface CartItem {
  productId: string
  name: string
  price: number
  qty: number
}
/** 訂單型別 */
interface Order {
  id: number
  name: string
  address: string
  note: string
  items: CartItem[]
  total: number
  time: string
}

// ════════════════════════════════════════════════════════════════
// ① useProductStore — 商品目錄
// ════════════════════════════════════════════════════════════════
const useProductStore = defineStore('products-q99', {
  state: () => ({
    products: [
      { id: 'p1', name: 'Vue 3 入門書',         category: '書籍', price: 580  },
      { id: 'p2', name: 'TypeScript 完全指南',   category: '書籍', price: 650  },
      { id: 'p3', name: '機械鍵盤（青軸）',       category: '3C',   price: 2800 },
      { id: 'p4', name: '27 吋 4K 顯示器',       category: '3C',   price: 8500 },
      { id: 'p5', name: '人體工學椅',             category: '家具', price: 12000 },
    ],
    selectedCategory: 'all',
  }),

  getters: {
    // TODO 1：filteredProducts — 依 selectedCategory 篩選
    // 'all' 時回傳全部，否則回傳 category 符合的商品
    filteredProducts: /* TODO */ null as any, // as any 避免 null getter 導致 defineStore overload 錯誤
  },

  actions: {
    setCategory(cat: string) { this.selectedCategory = cat }, // 參數加型別避免隱式 any
  },
})

// ════════════════════════════════════════════════════════════════
// ② useCartStore — 購物車
// ════════════════════════════════════════════════════════════════
const useCartStore = defineStore('cart-q99', {
  state: () => ({
    // 明確型別：避免推断為 never[]
    items: [] as CartItem[],
  }),

  getters: {
    // TODO 2：totalQty — 所有商品數量加總（用於 badge 顯示）
    totalQty:   /* TODO */ null as any,

    // TODO 3：totalPrice — 所有商品 price × qty 加總
    totalPrice: /* TODO */ null as any,
  },

  actions: {
    // TODO 4：addItem(product)
    // - 若購物車已有該商品（productId 相同），qty + 1
    // - 若沒有，push { productId: product.id, name: product.name, price: product.price, qty: 1 }
    addItem(product: Product) {
      /* TODO */
    },

    // TODO 5：removeItem(productId) — 從 items 移除對應商品
    removeItem(productId: string) {
      /* TODO */
    },

    // TODO 6：updateQty(productId, delta)
    // - 找到商品，qty += delta
    // - 若 qty <= 0，移除該商品
    updateQty(productId: string, delta: number) {
      /* TODO */
    },

    // TODO 7：clear() — 清空購物車
    clear() {
      /* TODO */
    },
  },
})

// ════════════════════════════════════════════════════════════════
// ③ useCheckoutStore — 結帳
// ════════════════════════════════════════════════════════════════
const useCheckoutStore = defineStore('checkout-q99', {
  state: () => ({
    // 表單欄位
    form: {
      name:    '',
      address: '',
      note:    '',
    },
    // 欄位驗證錯誤訊息
    errors: {} as Record<string, string>, // 明確型別：允許動態鍵存取錯誤訊息
    // 歷史訂單
    orders: [] as Order[],               // 明確型別：避免推断為 never[]
  }),

  actions: {
    // TODO 8：placeOrder()
    // 1. 驗證：name / address 不可為空，否則 errors 記錄錯誤訊息，return
    // 2. 取得 cartStore，確認 items.length > 0，否則 errors.cart = '購物車是空的'，return
    // 3. 建立訂單物件：{ id: Date.now(), ...form, items: 快照, total: totalPrice, time }
    // 4. push 到 this.orders
    // 5. 呼叫 cartStore.clear() 清空購物車
    // 6. 清空 form 和 errors
    placeOrder() {
      /* TODO */
    },
  },
})

// ── 在元件中使用所有 Store ────────────────────────────────────────
const productStore  = useProductStore()
const cartStore     = useCartStore()
const checkoutStore = useCheckoutStore()

const { filteredProducts, selectedCategory } = storeToRefs(productStore)
const { items, totalQty, totalPrice }        = storeToRefs(cartStore)
const { form, errors, orders }               = storeToRefs(checkoutStore)

// 分頁切換（商品 / 購物車 / 結帳）
const currentTab = ref('products')
const categories = ['all', '書籍', '3C', '家具']
</script>

<template>
  <div class="cart-demo">
    <h3>🍍 Q99 — 購物車（多 Store 協作）（練習）</h3>

    <!-- ── 頂部 Tab 導覽 ── -->
    <div class="tab-bar">
      <button
        v-for="tab in ['products', 'cart', 'checkout']"
        :key="tab"
        class="tab-btn"
        :class="{ active: currentTab === tab }"
        @click="currentTab = tab"
      >
        <span v-if="tab === 'products'">商品目錄</span>
        <span v-else-if="tab === 'cart'">
          購物車
          <span v-if="totalQty" class="badge">{{ totalQty }}</span>
        </span>
        <span v-else>結帳</span>
      </button>
    </div>

    <!-- ════ 商品目錄 ════ -->
    <section v-if="currentTab === 'products'" class="tab-content">

      <!-- 分類篩選 -->
      <div class="category-row">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="productStore.setCategory(cat)"
        >{{ cat }}</button>
      </div>

      <!-- 商品列表 -->
      <div v-if="filteredProducts" class="product-grid">
        <div v-for="p in filteredProducts" :key="p.id" class="product-card">
          <div class="product-info">
            <p class="product-name">{{ p.name }}</p>
            <p class="product-cat">{{ p.category }}</p>
            <p class="product-price">NT$ {{ p.price.toLocaleString() }}</p>
          </div>
          <button class="btn btn-sm" @click="cartStore.addItem(p)">加入購物車</button>
        </div>
      </div>
      <p v-else class="hint">完成 TODO 1 後商品會顯示</p>

    </section>

    <!-- ════ 購物車 ════ -->
    <section v-else-if="currentTab === 'cart'" class="tab-content">

      <div v-if="items && items.length" class="cart-list">
        <div v-for="item in items" :key="item.productId" class="cart-row">
          <div class="cart-info">
            <p class="cart-name">{{ item.name }}</p>
            <p class="cart-price">NT$ {{ item.price.toLocaleString() }}</p>
          </div>
          <div class="qty-ctrl">
            <button class="qty-btn" @click="cartStore.updateQty(item.productId, -1)">－</button>
            <span class="qty-val">{{ item.qty }}</span>
            <button class="qty-btn" @click="cartStore.updateQty(item.productId, +1)">＋</button>
          </div>
          <span class="item-subtotal">NT$ {{ (item.price * item.qty).toLocaleString() }}</span>
          <button class="btn-remove" @click="cartStore.removeItem(item.productId)">✕</button>
        </div>

        <div class="cart-total">
          <span>總計</span>
          <span class="total-price">NT$ {{ totalPrice?.toLocaleString() ?? '尚未實作' }}</span>
        </div>

        <div class="cart-actions">
          <button class="btn btn-outline btn-sm" @click="cartStore.clear">清空購物車</button>
          <button class="btn btn-sm" @click="currentTab = 'checkout'">前往結帳</button>
        </div>
      </div>
      <div v-else class="empty-cart">
        <p>購物車是空的</p>
        <button class="btn btn-sm btn-outline" @click="currentTab = 'products'">去逛逛</button>
      </div>

    </section>

    <!-- ════ 結帳 ════ -->
    <section v-else class="tab-content">

      <div class="checkout-form">
        <div class="form-group" :class="{ error: errors?.name }">
          <label class="form-label">收件人姓名 <span class="required">*</span></label>
          <input v-model="form.name" class="form-input" placeholder="請輸入姓名" />
          <p v-if="errors?.name" class="error-msg">{{ errors.name }}</p>
        </div>
        <div class="form-group" :class="{ error: errors?.address }">
          <label class="form-label">收件地址 <span class="required">*</span></label>
          <input v-model="form.address" class="form-input" placeholder="請輸入地址" />
          <p v-if="errors?.address" class="error-msg">{{ errors.address }}</p>
        </div>
        <div class="form-group">
          <label class="form-label">備註（選填）</label>
          <input v-model="form.note" class="form-input" placeholder="特殊要求或備註" />
        </div>
        <p v-if="errors?.cart" class="error-msg">{{ errors.cart }}</p>
        <button class="btn" @click="checkoutStore.placeOrder">確認下訂</button>
      </div>

      <!-- 訂單歷史 -->
      <div v-if="orders && orders.length" class="order-history">
        <h4>訂單歷史</h4>
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-time">{{ order.time }}</span>
          </div>
          <p class="order-name">{{ order.name }}｜{{ order.address }}</p>
          <p class="order-total">NT$ {{ order.total?.toLocaleString() }}</p>
        </div>
      </div>

    </section>

  </div>
</template>

<style scoped>
.cart-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.tab-bar { display: flex; gap: 4px; background: var(--color-bg-card); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.tab-btn { flex: 1; padding: 8px; border: none; border-radius: var(--radius-sm); cursor: pointer; background: transparent; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; }
.tab-btn.active { background: var(--color-primary); color: #fff; }
.badge { background: #ef4444; color: #fff; border-radius: 999px; padding: 1px 6px; font-size: 0.7rem; font-weight: 700; }
.tab-content { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-md); }
.category-row { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.product-grid { display: flex; flex-direction: column; gap: 8px; }
.product-card { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.product-info { display: flex; flex-direction: column; gap: 2px; }
.product-name { font-weight: 600; font-size: var(--font-size-sm); }
.product-cat { font-size: 0.75rem; color: var(--color-text-muted); }
.product-price { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; font-size: var(--font-size-sm); }
.cart-list { display: flex; flex-direction: column; gap: 8px; }
.cart-row { display: flex; align-items: center; gap: var(--space-sm); padding: 10px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.cart-info { flex: 1; }
.cart-name { font-size: var(--font-size-sm); font-weight: 500; }
.cart-price { font-size: 0.75rem; color: var(--color-text-muted); }
.qty-ctrl { display: flex; align-items: center; gap: 6px; }
.qty-btn { width: 26px; height: 26px; border: 1.5px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: 0.9rem; display: flex; align-items: center; justify-content: center; }
.qty-val { font-family: var(--font-mono); font-weight: 600; min-width: 24px; text-align: center; }
.item-subtotal { font-family: var(--font-mono); color: var(--color-primary); font-weight: 600; font-size: var(--font-size-sm); min-width: 100px; text-align: right; }
.btn-remove { width: 24px; height: 24px; border: none; background: transparent; color: var(--color-text-muted); cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.btn-remove:hover { background: #fee2e2; color: #dc2626; }
.cart-total { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--color-border); font-weight: 600; }
.total-price { font-family: var(--font-mono); color: var(--color-primary); font-size: 1.1rem; }
.cart-actions { display: flex; justify-content: flex-end; gap: 8px; }
.empty-cart { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); padding: var(--space-lg); color: var(--color-text-muted); }
.checkout-form { display: flex; flex-direction: column; gap: var(--space-sm); }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group.error .form-input { border-color: #ef4444; }
.form-label { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text); }
.required { color: #ef4444; }
.form-input { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; }
.form-input:focus { border-color: var(--color-primary); }
.error-msg { font-size: 0.75rem; color: #dc2626; }
.order-history { display: flex; flex-direction: column; gap: var(--space-sm); padding-top: var(--space-md); border-top: 1px solid var(--color-border); }
.order-card { padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 4px; }
.order-header { display: flex; justify-content: space-between; align-items: center; }
.order-id { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-muted); }
.order-time { font-size: 0.75rem; color: var(--color-text-muted); }
.order-name { font-size: var(--font-size-sm); }
.order-total { font-family: var(--font-mono); font-weight: 600; color: var(--color-primary); font-size: var(--font-size-sm); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 6px 16px; font-size: 0.8rem; }
</style>
