# Q06 — Store 之間的組合與相互呼叫

## 對應官方文件
- 章節：Composing Stores
- URL：https://pinia.vuejs.org/cookbook/composing-stores

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
在實際應用中，多個 Store 之間常需要相互存取，常見模式：

**在 Action 中呼叫另一個 Store：**
```js
// 在 CartStore 的 action 中
import { useUserStore } from './userStore'

actions: {
  checkout() {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn) return '請先登入'
    // 繼續結帳流程...
  }
}
```

注意：**在 Setup Store 中**可在 `setup()` 函式頂部直接呼叫另一個 Store，
但在 **Options Store** 中必須在 action/getter 內部呼叫（不能在 state/getters 定義時呼叫）。

## 起手式說明
`Starter.vue` 中已有：
- `useAuthStore`：管理登入狀態與使用者角色（已完成，參考用）
- `useNotificationStore`：管理通知訊息（已完成，參考用）
- `useOrderStore`：**TODO** — 需要整合 Auth 與 Notification 的訂單系統

請你完成 `useOrderStore` 中的所有 TODO：
1. `state`：訂單清單、isLoading
2. `placeOrder(item)`：檢查登入 → 新增訂單 → 推播成功通知
3. `cancelOrder(id)`：移除訂單 → 推播取消通知
4. 如果未登入，顯示「請先登入」通知並拒絕操作

## 驗收標準
- [ ] 未登入時下訂單 → 顯示「請先登入」通知，訂單不增加
- [ ] 登入後下訂單 → 訂單出現在列表，顯示成功通知
- [ ] 取消訂單 → 訂單從列表移除，顯示取消通知
- [ ] 通知可以手動關閉（useNotificationStore 已實作）
