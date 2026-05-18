# Q04 — 導航守衛（beforeEach / beforeEnter）

## 對應官方文件
- 章節：Navigation Guards
- URL：https://router.vuejs.org/guide/advanced/navigation-guards

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
導航守衛讓你在路由切換前執行邏輯（驗證權限、重新導向、取消導航）。
常見使用場景：未登入時自動導向登入頁、限制特定角色才能進入後台。

有三種守衛層級：
1. **全域守衛**（`router.beforeEach`）— 每次路由切換都執行
2. **路由層守衛**（`beforeEnter`）— 只在進入特定路由時執行
3. **元件守衛**（`onBeforeRouteLeave`）— 在元件內定義，離開時執行

## 起手式說明
`Starter.vue` 中已有：
- 模擬的 auth 狀態（`isLoggedIn` ref）和使用者角色（`userRole`）
- 多個模擬「頁面」按鈕
- `simulateNavigation(target)` 函式骨架（需要你實作守衛邏輯）

請你實作：
1. `checkAuth(target)` — 模擬 beforeEach 守衛邏輯
2. 回傳值：`true`（允許）/ `false`（拒絕）/ `{ redirect: '/login' }`（重導向）

## 驗收標準
- [ ] 未登入時，訪問任何需要認證的頁面都被重導向到登入頁
- [ ] 已登入但角色不符時，顯示 403 Forbidden
- [ ] 公開頁面（login、home）不需要登入即可訪問
- [ ] 理解 `return false`（取消導航）vs `return { name: 'login' }`（重導向）

## 提示
- `router.beforeEach((to, from) => { ... })` — 全域守衛，需在 main.js 中設定
- 回傳值：`undefined / true`（繼續）/ `false`（取消）/ `路由物件`（重導向）
- `to.meta.requiresAuth` — 檢查目標路由是否需要認證（需在路由設定 meta 欄位）
- 本題在元件內模擬守衛邏輯，概念與真實 router 守衛完全相同
