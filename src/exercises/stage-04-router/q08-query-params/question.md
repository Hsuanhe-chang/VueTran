# Q08 — 路由查詢字串（Query Parameters）

## 對應官方文件
- 章節：Programmatic Navigation — Query Parameters
- URL：https://router.vuejs.org/guide/essentials/navigation

## 題型
從零撰寫

## 難度
⭐ 基礎

## 題目說明
Query Parameters（查詢字串）是 URL `?` 後面的鍵值對：
`/posts?category=vue&sort=newest&page=2`

與 `params`（動態段）不同，`query` 不需要在路由設定中宣告，
任何路由都可以攜帶任意 query params。

常見用途：
- 搜尋 / 篩選：`?q=keyword&category=tech`
- 分頁：`?page=3&pageSize=20`
- 排序：`?sort=price&order=asc`

## 起手式說明
`Starter.vue` 中已有：
- 商品列表資料（帶分類和評分）
- UI 骨架：搜尋框、分類 Tab、排序選擇
- TODO：用 `useRoute` 讀取 query，用 `useRouter` 更新 query

請你實作：
1. 讀取 `route.query.q`、`route.query.category`、`route.query.sort`
2. 用 `router.push({ query: {...} })` 在 UI 操作時更新 query params
3. 根據 query 計算 `filteredProducts`

## 驗收標準
- [ ] 修改搜尋詞、分類、排序時，URL query params 同步更新
- [ ] 重新整理後，query params 仍保留（直接讀取 URL）
- [ ] `filteredProducts` 根據 query 正確過濾 + 排序
- [ ] 複製 URL 分享給別人，看到的結果相同（分享狀態）

## 提示
- `route.query.search` — 讀取 `?search=xxx`（永遠是字串或 undefined）
- `router.push({ query: { search: value, category: 'all' } })` — 整個 query 物件重設
- `router.replace({ query: { ...route.query, page: 2 } })` — 只修改部分 query
- Query params 不需在路由定義中宣告，可直接加在任何路由的 URL 上
