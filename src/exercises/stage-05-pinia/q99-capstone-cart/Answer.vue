<script setup>
/** Q99 — 綜合題：購物車（多 Store 協作）（解答）
 *
 *  整合：
 *  1. useProductStore  — filteredProducts getter（依分類篩選）
 *  2. useCartStore     — addItem 去重/累加、updateQty 數量控制、totalQty/totalPrice
 *  3. useCheckoutStore — 表單驗證、placeOrder（呼叫 cartStore.clear()）、訂單歷史
 */
import { ref }                       from 'vue'
import { defineStore, storeToRefs }  from 'pinia'

// ════════════════════════════════════════════════════════════════
// ① useProductStore
// ════════════════════════════════════════════════════════════════
const useProductStore = defineStore('products-q99-ans', {
  state: () => ({
    products: [
      { id: 'p1', name: 'Vue 3 入門書',         category: '書籍', price: 580   },
      { id: 'p2', name: 'TypeScript 完全指南',   category: '書籍', price: 650   },
      { id: 'p3', name: '機械鍵盤（青軸）',       category: '3C',   price: 2800  },
      { id: 'p4', name: '27 吋 4K 顯示器',       category: '3C',   price: 8500  },
      { id: 'p5', name: '人體工學椅',             category: '家具', price: 12000 },
    ],
    selectedCategory: 'all',
  }),

  getters: {
    // 'all' 回傳全部，否則過濾 category
    filteredProducts: (state) =>
      state.selectedCategory === 'all'
        ? state.products
        : state.products.filter(p => p.category === state.selectedCategory),
  },

  actions: {
    setCategory(cat) { this.selectedCategory = cat },
  },
})

// ════════════════════════════════════════════════════════════════
// ② useCartStore
// ════════════════════════════════════════════════════════════════
const useCartStore = defineStore('cart-q99-ans', {
  state: () => ({
    // items: [{ productId, name, price, qty }]
    items: [],
  }),

  getters: {
    // 所有 qty 加總 → 購物車 badge 數字
    totalQty: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),

    // price × qty 的總和
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  },

  actions: {
    // 加入商品：已存在則 qty+1，否則新增
    addItem(product) {
      const existing = this.items.find(i => i.productId === product.id)
      if (existing) {
        existing.qty++
      } else {
        this.items.push({
          productId: product.id,
          name:      product.name,
          price:     product.price,
          qty:       1,
        })
      }
    },

    // 移除商品（直接移除，不管數量）
    removeItem(productId) {
      this.items = this.items.filter(i => i.productId !== productId)
    },

    // 數量增減：qty 降到 0 以下時自動移除
    updateQty(productId, delta) {
      const item = this.items.find(i => i.productId === productId)
      if (!item) return
      item.qty += delta
      if (item.qty <= 0) this.removeItem(productId)
    },

    // 清空購物車（結帳後呼叫）
    clear() {
      this.items = []
    },
  },
})

// ════════════════════════════════════════════════════════════════
// ③ useCheckoutStore
// ════════════════════════════════════════════════════════════════
const useCheckoutStore = defineStore('checkout-q99-ans', {
  state: () => ({
    form: {
      name:    '',
      address: '',
      note:    '',
    },
    errors: {},
    orders: [],
  }),

  actions: {
    placeOrder() {
      // ① 驗證必填欄位
      const newErrors = {}
      if (!this.form.name.trim())    newErrors.name    = '請輸入收件人姓名'
      if (!this.form.address.trim()) newErrors.address = '請輸入收件地址'

      // ② 驗證購物車不為空
      const cartStore = useCartStore()
      if (cartStore.items.length === 0) newErrors.cart = '購物車是空的，請先加入商品'

      // 有任何錯誤就停止
      if (Object.keys(newErrors).length > 0) {
        this.errors = newErrors
        return
      }

      // ③ 建立訂單（快照 items，避免清空後遺失）
      const now   = new Date().toLocaleString('zh-TW')
      const order = {
        id:      Date.now(),
        name:    this.form.name,
        address: this.form.address,
        note:    this.form.note,
        items:   cartStore.items.map(i => ({ ...i })),  // 快照
        total:   cartStore.totalPrice,
        time:    now,
      }
      this.orders.unshift(order)  // 最新訂單排最前面

      // ④ 清空購物車
      cartStore.clear()

      // ⑤ 重置表單與錯誤
      this.form   = { name: '', address: '', note: '' }
      this.errors = {}
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

const currentTab = ref('products')
const categories = ['all', '書籍', '3C', '家具']
</script>

<template>
  <div class="cart-demo">
    <h3>🍍 Q99 — 購物車（多 Store 協作）（解答）</h3>

    <!-- ── 頂部 Tab 導覽 ── -->
    <div class="tab-bar">
      <button
        v-for="tab in ['products', 'cart', 'checkout']"
        :key="tab"
        class="tab-btn"
        :class="{ active: currentTab === tab }"
        @click="currentTab = tab"
      >
        <span v-if="tab === 'products'">商品目錄（{{ productStore.products.length }}）</span>
        <span v-else-if="tab === 'cart'">
          購物車
          <span v-if="totalQty" class="badge">{{ totalQty }}</span>
        </span>
        <span v-else>結帳（{{ orders.length }} 筆訂單）</span>
      </button>
    </div>

    <!-- ════ 商品目錄 ════ -->
    <section v-if="currentTab === 'products'" class="tab-content">

      <div class="category-row">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="productStore.setCategory(cat)"
        >{{ cat }}</button>
      </div>

      <div class="product-grid">
        <div v-for="p in filteredProducts" :key="p.id" class="product-card">
          <div class="product-info">
            <p class="product-name">{{ p.name }}</p>
            <p class="product-cat">{{ p.category }}</p>
            <p class="product-price">NT$ {{ p.price.toLocaleString() }}</p>
          </div>
          <button class="btn btn-sm" @click="cartStore.addItem(p)">加入購物車</button>
        </div>
      </div>

    </section>

    <!-- ════ 購物車 ════ -->
    <section v-else-if="currentTab === 'cart'" class="tab-content">

      <div v-if="items.length" class="cart-list">
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
          <span>總計（{{ totalQty }} 件）</span>
          <span class="total-price">NT$ {{ totalPrice.toLocaleString() }}</span>
        </div>

        <div class="cart-actions">
          <button class="btn btn-outline btn-sm" @click="cartStore.clear">清空購物車</button>
          <button class="btn btn-sm" @click="currentTab = 'checkout'">前往結帳 →</button>
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
        <h4>填寫收件資料</h4>

        <div class="form-group" :class="{ 'has-error': errors.name }">
          <label class="form-label">收件人姓名 <span class="required">*</span></label>
          <input v-model="form.name" class="form-input" placeholder="請輸入姓名" />
          <p v-if="errors.name" class="error-msg">{{ errors.name }}</p>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.address }">
          <label class="form-label">收件地址 <span class="required">*</span></label>
          <input v-model="form.address" class="form-input" placeholder="請輸入地址" />
          <p v-if="errors.address" class="error-msg">{{ errors.address }}</p>
        </div>

        <div class="form-group">
          <label class="form-label">備註（選填）</label>
          <input v-model="form.note" class="form-input" placeholder="特殊要求…" />
        </div>

        <!-- 購物車空的時的錯誤 -->
        <p v-if="errors.cart" class="error-msg">{{ errors.cart }}</p>

        <!-- 購物車摘要 -->
        <div v-if="totalQty" class="order-summary">
          <span>購物車（{{ totalQty }} 件）</span>
          <span class="total-price">NT$ {{ totalPrice.toLocaleString() }}</span>
        </div>

        <button class="btn" @click="checkoutStore.placeOrder">確認下訂</button>
      </div>

      <!-- 訂單歷史 -->
      <div v-if="orders.length" class="order-history">
        <h4>訂單歷史（{{ orders.length }} 筆）</h4>
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-time">{{ order.time }}</span>
          </div>
          <p class="order-name">{{ order.name }}｜{{ order.address }}</p>
          <div class="order-items">
            <span v-for="item in order.items" :key="item.productId" class="order-item-tag">
              {{ item.name }} ×{{ item.qty }}
            </span>
          </div>
          <p class="order-total">NT$ {{ order.total.toLocaleString() }}</p>
        </div>
      </div>

    </section>

  </div>
</template>

<style scoped>
.cart-demo { display: flex; flex-direction: column; gap: var(--space-md); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
h4 { color: var(--color-secondary); margin-bottom: var(--space-sm); }
.tab-bar { display: flex; gap: 4px; background: var(--color-bg-card); padding: 4px; border-radius: var(--radius-md); border: 1px solid var(--color-border); }
.tab-btn { flex: 1; padding: 8px; border: none; border-radius: var(--radius-sm); cursor: pointer; background: transparent; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 6px; }
.tab-btn.active { background: var(--color-primary); color: #fff; }
.badge { background: #ef4444; color: #fff; border-radius: 999px; padding: 1px 6px; font-size: 0.7rem; font-weight: 700; }
.tab-content { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-md); }
.category-row { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn { padding: 4px 14px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); }
.cat-btn.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
.product-grid { display: flex; flex-direction: column; gap: 8px; }
.product-card { display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); transition: border-color 0.15s; }
.product-card:hover { border-color: var(--color-primary); }
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
.cart-total { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--color-border); font-weight: 600; font-size: var(--font-size-sm); }
.total-price { font-family: var(--font-mono); color: var(--color-primary); font-size: 1.1rem; }
.cart-actions { display: flex; justify-content: flex-end; gap: 8px; }
.empty-cart { display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); padding: var(--space-lg); color: var(--color-text-muted); }
.checkout-form { display: flex; flex-direction: column; gap: var(--space-sm); }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group.has-error .form-input { border-color: #ef4444; }
.form-label { font-size: var(--font-size-sm); font-weight: 500; }
.required { color: #ef4444; }
.form-input { padding: 8px 12px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; }
.form-input:focus { border-color: var(--color-primary); }
.error-msg { font-size: 0.75rem; color: #dc2626; }
.order-summary { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.2); border-radius: var(--radius-md); font-size: var(--font-size-sm); }
.order-history { display: flex; flex-direction: column; gap: var(--space-sm); padding-top: var(--space-md); border-top: 1px solid var(--color-border); }
.order-card { padding: var(--space-sm); background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 4px; }
.order-header { display: flex; justify-content: space-between; align-items: center; }
.order-id { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-muted); }
.order-time { font-size: 0.75rem; color: var(--color-text-muted); }
.order-name { font-size: var(--font-size-sm); }
.order-items { display: flex; gap: 4px; flex-wrap: wrap; }
.order-item-tag { font-size: 0.75rem; padding: 1px 8px; background: var(--color-border); border-radius: 999px; color: var(--color-text-muted); }
.order-total { font-family: var(--font-mono); font-weight: 600; color: var(--color-primary); font-size: var(--font-size-sm); }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-outline { background: transparent; color: var(--color-primary); border: 1.5px solid var(--color-primary); }
.btn-sm { padding: 6px 16px; font-size: 0.8rem; }
</style>
