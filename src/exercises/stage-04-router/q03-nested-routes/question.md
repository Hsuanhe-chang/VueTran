# Q03 — 巢狀路由（Nested Routes）

## 對應官方文件
- 章節：Nested Routes
- URL：https://router.vuejs.org/guide/essentials/nested-routes

## 題型
填空 + 找錯誤

## 難度
⭐⭐ 中級

## 題目說明
巢狀路由讓你可以在某個頁面的 `<RouterView />` 中再渲染另一個子頁面，
適合「Tab 頁面」、「後台側欄」等需要共用父層 UI 的情境。

路由設定中用 `children` 陣列定義子路由；
父元件的 template 中必須有 `<RouterView />` 才能顯示子路由對應的元件。

## 起手式說明
`Starter.vue` 中已有：
- 帶有兩個 Bug 的巢狀路由設定（在 `<pre>` 中）
- 一個填空框架，需要你補上正確的 children 路由設定

請你：
1. 找出 Bug 並說明原因
2. 填入正確的巢狀路由設定（children 陣列）

## 驗收標準
- [ ] 能找出 Bug A：子路由 path 不應加前導 `/`（會變成絕對路徑）
- [ ] 能找出 Bug B：父元件 template 少了 `<RouterView />`
- [ ] 理解 `children` 陣列中 path 為空字串（`''`）代表預設子路由
- [ ] 知道父路由渲染子路由的關鍵：父元件模板中必須有 `<RouterView />`

## 提示
- 子路由的 `path` 是相對於父路由的（不要加 `/`）
- `path: ''` — 空字串代表「進入父路由時的預設子頁面」
- `path: 'profile'` — 完整 URL 是 `/user/profile`（自動拼接父路由 /user）
- 父元件必須有 `<RouterView />` 才能顯示子路由；少了就只顯示父層 UI
