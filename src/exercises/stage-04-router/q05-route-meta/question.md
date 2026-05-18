# Q05 — 路由 Meta 欄位與權限控制

## 對應官方文件
- 章節：Route Meta Fields
- URL：https://router.vuejs.org/guide/advanced/meta

## 題型
功能實作

## 難度
⭐⭐ 中級

## 題目說明
每條路由都可以加上 `meta` 物件，存放任意自訂資料。
最常見的用途是權限旗標：

```js
{ path: '/admin', meta: { requiresAuth: true, roles: ['admin'], title: '後台管理' } }
```

在守衛或元件中透過 `route.meta` 或 `to.meta` 讀取這些值。

## 起手式說明
`Starter.vue` 中已有：
- 模擬的路由表（含 meta 欄位）
- 頁面切換 UI
- TODO：根據 meta 欄位實作「麵包屑導航」和「頁面標題」顯示

請你實作：
1. 讀取 `currentRoute.meta.title` 顯示頁面標題
2. 讀取 `currentRoute.meta.breadcrumb` 組合麵包屑路徑
3. 讀取 `currentRoute.meta.requiresAuth` 決定是否顯示鎖頭圖示

## 驗收標準
- [ ] 切換頁面時，標題正確更新
- [ ] 麵包屑路徑正確顯示（根據 meta.breadcrumb 陣列）
- [ ] 需要認證的頁面顯示鎖頭圖示
- [ ] 知道如何在 beforeEach 守衛中讀取 `to.meta.requiresAuth`

## 提示
- `route.meta.title` — 讀取當前路由的 meta.title
- `route.meta.breadcrumb` — 讀取麵包屑路徑陣列
- 在守衛中：`to.meta.requiresAuth` 讀取目標路由的 meta
- 設置頁面標題：`document.title = route.meta.title + ' | My App'`
