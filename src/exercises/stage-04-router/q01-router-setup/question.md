# Q01 — createRouter / createWebHistory 基礎設定

## 對應官方文件
- 章節：Vue Router — Getting Started
- URL：https://router.vuejs.org/guide/

## 題型
填空

## 難度
⭐ 基礎

## 題目說明
Vue Router 是 Vue 官方的路由解決方案。使用前需要呼叫 `createRouter()` 建立 router 實例，
並在 `main.js` 中用 `app.use(router)` 安裝。

本題練習完成一份標準的 Vue Router 設定，包含：
1. 選擇 History 模式（HTML5 History vs Hash）
2. 定義路由表（routes 陣列）
3. 各路由的必要欄位（path / name / component）

## 起手式說明
`Starter.vue` 中已有：
- 路由設定的骨架（`createRouter` 呼叫、routes 陣列結構）
- 多處 `/* TODO */` 需要填入

請你填入：
1. `history` 選項：使用 `createWebHistory(import.meta.env.BASE_URL)`
2. 每條路由的 `path`、`name`、`component`（懶載入寫法）
3. `scrollBehavior` 讓換頁時自動捲回頂部

## 驗收標準
- [ ] 能正確說明 `createWebHistory` vs `createWebHashHistory` 的差異
- [ ] 每條路由都使用懶載入（`() => import(...)`），不用靜態 import
- [ ] `scrollBehavior` 回傳 `{ top: 0 }` 讓換頁後捲至頂部
- [ ] 了解 `name` 欄位的用途（程式化導航時可用 `{ name: 'home' }` 代替路徑字串）

## 提示
- `createWebHistory()` — HTML5 History API，URL 無 `#`（需伺服器設定）
- `createWebHashHistory()` — Hash 模式，URL 含 `#/`，純前端可用
- `import.meta.env.BASE_URL` — Vite 注入的應用程式基底 URL（通常是 `/`）
- 懶載入：`component: () => import('./views/HomeView.vue')`
