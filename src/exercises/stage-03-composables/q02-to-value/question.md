# Q02 — 響應式參數傳遞（toValue / MaybeRef）

## 對應官方文件
- 章節：Composables — toValue()
- URL：https://vuejs.org/guide/reusability/composables#accepting-reactive-state

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
實作 `useFormatPrice(source, currency)` composable，讓它彈性接受以下三種輸入：
- 普通數值：`useFormatPrice(299)`
- ref：`useFormatPrice(ref(299))`
- getter 函式：`useFormatPrice(() => product.price)`

## 起手式說明
`Starter.vue` 中已有：
- 三種輸入方式的使用示範
- composable 骨架（缺少 toValue 的使用）

請你完成：
1. 在 `useFormatPrice` 內用 `computed(() => toValue(source))` 取得當前值
2. 用 `Intl.NumberFormat` 格式化為貨幣字串

## 驗收標準
- [ ] 三種傳入方式（數值、ref、getter）都能正確顯示格式化價格
- [ ] 改變 ref 或 getter 的來源值後，格式化結果自動更新
- [ ] 使用 `toValue()` 而非手動判斷 `isRef()`

## 提示
- `toValue(source)` — 不管 source 是值、ref 或 getter，都回傳純值
- `computed(() => toValue(source))` — 確保來源有響應性時自動更新
- `new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD' }).format(n)` — 台幣格式化
