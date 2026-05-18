# Q01 — defineProps 定義與型別驗證

## 對應官方文件
- 章節：Component Props
- URL：https://vuejs.org/guide/components/props

## 題型
填空 + 找錯誤

## 難度
⭐ 基礎

## 題目說明
你正在實作一個 `ProductCard` 子元件，供父層傳入商品資料並渲染。

## 起手式說明
`Starter.vue` 中已有：
- 完整的 template（ProductCard UI + 找錯誤區域）
- 佔位常數，讓 UI 在實作前可正常渲染

請你完成：
1. 將佔位常數替換為正確的 `defineProps` 定義
2. 找出 Part B 中 2 個錯誤的 prop 定義並說明原因

## 驗收標準
- [ ] `product` 定義為 Object 型別且 `required: true`
- [ ] `isFeatured` 為 Boolean，預設值 `false`
- [ ] `category` 為 String，預設值 `'未分類'`
- [ ] `stock` 為 Number，預設值 `0`
- [ ] 正確指出 Bug 1：`type` 應為建構式（`String`），不是字串（`'String'`）
- [ ] 正確指出 Bug 2：`required: true` 與 `default` 同時使用沒有意義

## 提示
- `type` 使用 JS 建構式：`String`、`Number`、`Boolean`、`Object`、`Array`
- `required: true` 代表父層不傳時 Vue 發出警告
- `default` 提供備援值；必填 prop 不需要 default
