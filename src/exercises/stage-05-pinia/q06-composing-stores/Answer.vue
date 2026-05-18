<script setup>
/** Q06 — Store 之間的組合與相互呼叫（解答）
 *
 *  重點：
 *  1. Options Store 的 action 內部才能呼叫其他 store（不能在 state 定義時）
 *  2. Setup Store 可在 setup 函式頂層直接呼叫（更自然）
 *  3. 呼叫其他 store 只需要 useXxxStore()，不需要 import pinia 實例
 *  4. Pinia 的 store 是單例（singleton），跨元件共享同一個實例
 */
import { ref }                       from 'vue'
import { defineStore, storeToRefs }  from 'pinia'

// ── useAuthStore（已完成）────────────────────────────────────────
const useAuthStore = defineStore('auth-q06-ans', {
  state: () => ({
    isLoggedIn: false,
    username:   '',
  }),
  actions: {
    login(name)  { this.isLoggedIn = true;  this.username = name },
    logout()     { this.isLoggedIn = false; this.username = '' },
  },
})

// ── useNotificationStore（已完成）───────────────────────────────
const useNotificationStore = defineStore('notification-q06-ans', {
  state: () => ({
    messages: [],
  }),
  actions: {
    push(text, type = 'success') {
      const id = Date.now()
      this.messages.push({ id, text, type })
      setTimeout(() => { this.messages = this.messages.filter(m => m.id !== id) }, 3000)
    },
    dismiss(id) {
      this.messages = this.messages.filter(m => m.id !== id)
    },
  },
})

// ── useOrderStore — 在 action 內呼叫其他 store ───────────────────
const useOrderStore = defineStore('order-q06-ans', {
  state: () => ({
    orders:    [],
    isLoading: false,
  }),

  actions: {
    placeOrder(item) {
      // Options Store 的 action 內部才呼叫其他 store
      const authStore         = useAuthStore()
      const notificationStore = useNotificationStore()

      // ① 驗證：未登入則拒絕並通知
      if (!authStore.isLoggedIn) {
        notificationStore.push('請先登入才能下訂單', 'error')
        return
      }

      // ② 成立訂單
      const now = new Date().toLocaleTimeString('zh-TW')
      this.orders.push({ id: Date.now(), item, time: now })

      // ③ 通知成功
      notificationStore.push(`訂單已成立：${item} ✓`, 'success')
    },

    cancelOrder(id) {
      const notificationStore = useNotificationStore()

      // 移除訂單
      this.orders = this.orders.filter(o => o.id !== id)

      // 通知取消
      notificationStore.push('訂單已取消', 'warning')
    },
  },
})

// ── 在元件中使用 ─────────────────────────────────────────────────
const authStore         = useAuthStore()
const notificationStore = useNotificationStore()
const orderStore        = useOrderStore()

const { isLoggedIn, username } = storeToRefs(authStore)

const loginName = ref('')
function handleLogin() {
  if (!loginName.value.trim()) return
  authStore.login(loginName.value.trim())
  loginName.value = ''
}

const items = ['Vue 3 入門書', 'TypeScript 完全指南', '機械鍵盤', '人體工學椅']
</script>

<template>
  <div class="composing-demo">
    <h3>🍍 Q06 — Store 之間的組合（解答）</h3>

    <!-- ── 通知訊息（固定在右上角）── -->
    <div class="notification-container">
      <div
        v-for="msg in notificationStore.messages"
        :key="msg.id"
        class="notification"
        :class="msg.type"
        @click="notificationStore.dismiss(msg.id)"
      >
        {{ msg.text }}
        <span class="dismiss">✕</span>
      </div>
    </div>

    <!-- ── 登入狀態 ── -->
    <section class="demo-section">
      <h4>Auth Store</h4>
      <div class="auth-bar">
        <div class="auth-status">
          <span :class="['status-dot', isLoggedIn ? 'online' : 'offline']" />
          <span>{{ isLoggedIn ? `已登入：${username}` : '未登入' }}</span>
        </div>
        <div v-if="!isLoggedIn" class="login-row">
          <input v-model="loginName" class="name-input" placeholder="輸入姓名登入…" @keydown.enter="handleLogin" />
          <button class="btn btn-sm" @click="handleLogin">登入</button>
        </div>
        <button v-else class="btn btn-sm btn-danger" @click="authStore.logout">登出</button>
      </div>
    </section>

    <!-- ── 下訂單 ── -->
    <section class="demo-section">
      <h4>Order Store（點擊商品下訂單）</h4>
      <p class="hint">
        {{ isLoggedIn ? '點擊下方商品即可下訂單' : '未登入時下訂單會觸發錯誤通知' }}
      </p>
      <div class="item-list">
        <button
          v-for="item in items"
          :key="item"
          class="item-btn"
          @click="orderStore.placeOrder(item)"
        >
          {{ item }}
        </button>
      </div>
    </section>

    <!-- ── 訂單列表 ── -->
    <section class="demo-section">
      <h4>訂單列表（{{ orderStore.orders.length }} 筆）</h4>
      <div v-if="orderStore.orders.length" class="order-list">
        <div v-for="order in orderStore.orders" :key="order.id" class="order-row">
          <span class="order-item">{{ order.item }}</span>
          <span class="order-time">{{ order.time }}</span>
          <button class="btn btn-xs btn-danger" @click="orderStore.cancelOrder(order.id)">取消</button>
        </div>
      </div>
      <p v-else class="hint">尚無訂單（登入後點商品）</p>
    </section>

    <!-- ── 跨 Store 呼叫說明 ── -->
    <section class="demo-section">
      <h4>✅ 跨 Store 呼叫寫法</h4>
      <pre v-pre class="code-block">// Options Store：在 action 內部呼叫其他 store
actions: {
  placeOrder(item) {
    const authStore = useAuthStore()  // 在 action 內呼叫
    if (!authStore.isLoggedIn) return

    const notifStore = useNotificationStore()
    notifStore.push('訂單已成立')
  }
}

// Setup Store：可在 setup 頂層呼叫（更自然）
defineStore('order', () => {
  const authStore  = useAuthStore()   // 頂層呼叫
  const notifStore = useNotificationStore()

  function placeOrder(item) {
    if (!authStore.isLoggedIn) return  // 直接使用
    notifStore.push('訂單成立')
  }

  return { placeOrder }
})</pre>
    </section>
  </div>
</template>

<style scoped>
.composing-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.notification-container { position: fixed; top: 16px; right: 16px; z-index: 100; display: flex; flex-direction: column; gap: 6px; min-width: 260px; }
.notification { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: 500; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.2s ease; }
@keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.notification.success { background: #dcfce7; color: #15803d; }
.notification.error   { background: #fee2e2; color: #dc2626; }
.notification.warning { background: #fef3c7; color: #d97706; }
.dismiss { margin-left: 8px; font-size: 0.8rem; opacity: 0.6; }
.auth-bar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-sm); }
.auth-status { display: flex; align-items: center; gap: 8px; font-size: var(--font-size-sm); font-weight: 500; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.online { background: #4ade80; }
.status-dot.offline { background: #94a3b8; }
.login-row { display: flex; gap: 6px; }
.name-input { padding: 6px 10px; border: 1.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: var(--font-size-sm); outline: none; }
.item-list { display: flex; gap: 6px; flex-wrap: wrap; }
.item-btn { padding: 8px 16px; border: 1.5px solid var(--color-primary); border-radius: var(--radius-md); cursor: pointer; background: rgba(99,102,241,0.08); color: var(--color-primary); font-size: var(--font-size-sm); font-weight: 500; transition: all 0.15s; }
.item-btn:hover { background: var(--color-primary); color: #fff; }
.order-list { display: flex; flex-direction: column; gap: 6px; }
.order-row { display: flex; align-items: center; gap: var(--space-sm); padding: 8px 12px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.order-item { flex: 1; font-weight: 500; }
.order-time { color: var(--color-text-muted); font-size: 0.75rem; }
.btn { padding: 8px 20px; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: var(--font-size-sm); font-weight: 600; background: var(--color-primary); color: #fff; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-sm { padding: 4px 12px; font-size: 0.8rem; }
.btn-xs { padding: 3px 10px; font-size: 0.75rem; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 500; }
.btn-xs.btn-danger { background: #ef4444; color: #fff; }
.code-block { background: #1e293b; color: #e2e8f0; padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: var(--font-size-sm); white-space: pre-wrap; line-height: 1.6; margin: 0; }
</style>
