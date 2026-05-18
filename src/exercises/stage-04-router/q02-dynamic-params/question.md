# Q02 — 動態路由參數（:id）與 useRoute

## 對應官方文件
- 章節：Dynamic Route Matching
- URL：https://router.vuejs.org/guide/essentials/dynamic-matching

## 題型
從零撰寫

## 難度
⭐ 基礎

## 題目說明
在 Vue Router 中，可以用 `:paramName` 定義動態路由片段。
例如 `/posts/:id` 可匹配 `/posts/1`、`/posts/abc`，
而 `route.params.id` 就會是 `'1'` 或 `'abc'`。

本題練習在元件中用 `useRoute()` 讀取當前路由的所有資訊，
並模擬一個「文章詳情頁」，根據 `:id` 查找對應文章資料。

## 起手式說明
`Starter.vue` 中已有：
- 文章資料陣列（articles）
- URL 模擬輸入框（讓你輸入不同 ID 體驗切換效果）
- TODO：用 `useRoute()` 讀取 params，查找對應文章

請你完成：
1. 用 `useRoute()` 取得路由實例
2. 讀取 `route.params.stageId` 和 `route.params.questionId`
3. 寫一個 `computed`，根據輸入的 ID 過濾文章

## 驗收標準
- [ ] 能正確用 `useRoute()` 讀取 `route.params`
- [ ] 了解 params 值永遠是**字串**型別（即使 URL 看起來像數字）
- [ ] 知道當參數改變時，元件**不會**重新建立（需用 `watch(route.params, ...)` 響應）
- [ ] 能區分 `route.params`（路徑動態段）vs `route.query`（查詢字串）

## 提示
- `const route = useRoute()` — 在 `<script setup>` 中呼叫
- `route.params.id` — 讀取動態路由段（永遠是字串）
- `route.params` 是響應式的，可以直接在 `computed` 或 `watch` 中使用
- 動態路由定義：`{ path: '/posts/:id', component: PostDetail }`
