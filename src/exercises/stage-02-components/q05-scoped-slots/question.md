# Q05 — Scoped Slots（作用域插槽）

## 對應官方文件
- 章節：Slots — Scoped Slots
- URL：https://vuejs.org/guide/components/slots#scoped-slots

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
`_DataList.vue` 已提供（不需修改）：它迭代一個 `items` 陣列，並透過 scoped slot 將每個 `item` 和 `index` 暴露給父層自訂渲染。

你（父層 Starter.vue）需要：
1. 用 `v-slot` 接收 `_DataList` 暴露的 `{ item, index }`
2. 自訂每一列的顯示格式

## 起手式說明
`Starter.vue` 中已有：
- 課程資料陣列 `courses`
- `DataList` 元件已匯入並使用

請你完成：
1. 在 `<DataList>` 標籤內寫 `<template v-slot:default="{ item, index }">` 或簡寫 `<template #default="{ item, index }">`
2. 用 `item.name`、`item.price`、`item.level`、`index` 顯示課程資訊

## 驗收標準
- [ ] 使用 `v-slot` 正確解構 `{ item, index }`
- [ ] 每列顯示序號（index + 1）、課程名稱、等級、價格
- [ ] 畫面顯示 3 筆課程資料，不再顯示預設備援文字

## 提示
- `v-slot:default="slotProps"` 或簡寫 `#default="slotProps"`
- 可直接解構：`#default="{ item, index }"`
- Scoped slot 讓子元件「暴露資料」給父層，父層決定渲染方式
