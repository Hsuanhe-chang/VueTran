<script setup lang="ts">
/** Q06 — Store 之間的組合與相互呼叫（從零撰寫）
 *
 *  跨 Store 呼叫原則：
 *  - Setup Store：可在 setup 函式頂部直接呼叫其他 store（推薦）
 *  - Options Store：必須在 action/getter 內部呼叫（不能在 state 定義時）
 *  - 無論哪種寫法，呼叫其他 store 都只需要 useXxxStore()，不需要 import Pinia 實例
 */
import { ref }        from 'vue'
import { defineStore, storeToRefs } from 'pinia'

// ── 【已完成】useAuthStore — 管理登入狀態 ────────────────────────
const useAuthStore = defineStore('auth-q06', {
  state: () => ({
    isLoggedIn: false,
    username:   '',
  }),
  actions: {
    login(name: string)  { this.isLoggedIn = true;  this.username = name },
    logout()             { this.isLoggedIn = false; this.username = '' },
  },
})

// ── 【已完成】useNotificationStore — 管理通知訊息 ────────────────
const useNotificationStore = defineStore('notification-q06', {
  state: () => ({
    // 明確型別：避免推断為 never[] 導致 push 失敗
    messages: [] as { id: number; text: string; type: string }[],  // [{ id, text, type: 'success'|'error'|'warning' }]
  }),
  actions: {
    push(text: string, type: string = 'success') {
      const id = Date.now()
      this.messages.push({ id, text, type })
      // 3 秒後自動移除
      setTimeout(() => { this.messages = this.messages.filter(m => m.id !== id) }, 3000)
    },
    dismiss(id: number) {
      this.messages = this.messages.filter(m => m.id !== id)
    },
  },
})

// ── 【TODO】useOrderStore — 整合 Auth 與 Notification ────────────
const useOrderStore = defineStore('order-q06', {
  state: () => ({
    // 明確型別：避免推断為 never[]
    orders:    [] as { id: number; item: string; time: string }[],   // [{ id, item, time }]
    isLoading: false,
  }),

  actions: {
    // TODO：placeOrder(item)
    // 1. 取得 authStore 實例，檢查 isLoggedIn
    // 2. 若未登入：呼叫 notificationStore.push('請先登入', 'error')，然後 return
    // 3. 若已登入：新增訂單到 this.orders，呼叫通知 '訂單已成立！'
    placeOrder(item: string) {
      /* TODO */
    },

    // TODO：cancelOrder(id)
    // 1. 從 this.orders 移除對應訂單
    // 2. 呼叫 notificationStore.push('訂單已取消', 'warning')
    cancelOrder(id: number) {
      /* TODO */
    },
  },
})

// ── 在元件中使用三個 Store ────────────────────────────────────────
const authStore         = useAuthStore()
const notificationStore = useNotificationStore()
const orderStore        = useOrderStore()

const { isLoggedIn, username } = storeToRefs(authStore)

// 登入輸入
const loginName = ref('')
function handleLogin() {
  if (!loginName.value.trim()) return
  authStore.login(loginName.value.trim())
  loginName.value = ''
}

// 快速下單的商品選項
const items = ['Vue 3 入門書', 'TypeScript 完全指南', '機械鍵盤', '人體工學椅']
</script>

<template>
  <div class="composing-demo">
    <h3>🍍 Q06 — Store 之間的組合（練習）</h3>

    <!-- ── 通知訊息 ── -->
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
      <h4>Order Store（TODO 完成後運作）</h4>
      <p class="hint">登入後才能下訂單，否則顯示錯誤通知</p>
      <div class="item-list">
        <button
          v-for="item in items"
          :key="item"
          class="item-btn"
          @click="orderStore.placeOrder(item)"
        >
          {{ item }} — 購買
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
      <p v-else class="hint">尚無訂單</p>
    </section>
  </div>
</template>

<style scoped>
.composing-demo { display: flex; flex-direction: column; gap: var(--space-lg); padding: var(--space-lg); background: var(--color-bg); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); }
.demo-section { padding: var(--space-md); background: var(--color-bg-card); border-radius: var(--radius-md); border: 1px solid var(--color-border); display: flex; flex-direction: column; gap: var(--space-sm); }
h4 { color: var(--color-secondary); margin-bottom: 4px; }
.hint { font-size: var(--font-size-sm); color: var(--color-text-muted); }
.notification-container { position: fixed; top: 16px; right: 16px; z-index: 100; display: flex; flex-direction: column; gap: 6px; min-width: 240px; }
.notification { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: 500; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
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
.item-btn { padding: 6px 14px; border: 1.5px solid var(--color-primary); border-radius: var(--radius-md); cursor: pointer; background: rgba(99,102,241,0.08); color: var(--color-primary); font-size: var(--font-size-sm); font-weight: 500; }
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
</style>
