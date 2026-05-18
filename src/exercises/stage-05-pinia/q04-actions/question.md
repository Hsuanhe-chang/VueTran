# Q04 — Actions 與非同步操作

## 對應官方文件
- 章節：Actions
- URL：https://pinia.vuejs.org/core-concepts/actions

## 題型
功能實作

## 難度
⭐⭐ 中級

## 題目說明
Pinia Actions 是 Store 中負責**業務邏輯**的函式，特性如下：
- 可以是同步或非同步（`async/await`）
- 可以存取並修改 `state`（透過 `this` 或 ref）
- 可以呼叫其他 Actions
- 非同步 Action 通常搭配 `isLoading` / `error` 狀態

本題模擬一個「使用者清單」API 功能：

| Action | 說明 |
|---|---|
| `fetchUsers()` | 非同步：從 mock API 取得使用者清單 |
| `addUser(name)` | 同步：在清單中新增一個使用者 |
| `removeUser(id)` | 同步：移除指定 id 的使用者 |
| `toggleRole(id)` | 同步：在 'user' / 'admin' 之間切換角色 |

## 起手式說明
`Starter.vue` 中已有：
- 完整的 UI（使用者列表 + 操作按鈕）
- `useUserListStore` 骨架，**TODO** 標記需要實作的 Actions

## 驗收標準
- [ ] 頁面載入時自動呼叫 `fetchUsers()`，載入期間顯示 Loading
- [ ] 載入失敗時顯示錯誤訊息
- [ ] 點擊「新增」可加入使用者
- [ ] 點擊「刪除」可移除使用者
- [ ] 點擊「切換角色」可在 user / admin 之間切換，顯示不同徽章
