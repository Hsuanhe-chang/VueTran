# Q04 — 預設插槽與具名插槽（Slots）

## 對應官方文件
- 章節：Slots
- URL：https://vuejs.org/guide/components/slots

## 題型
填空

## 難度
⭐ 基礎

## 題目說明
你正在實作 `SectionCard` 版面元件，它有三個區域：標題列、內容區、頁尾列。
父層透過插槽（slots）注入各區域的內容，元件本身只提供容器樣式。

## 起手式說明
`Starter.vue` 中已有：
- 完整的 template 結構（div 容器）
- 各位置的 TODO 註解

請你完成：
1. 在 `header` 區加入**具名插槽** `name="header"`，附帶備援文字「預設標題」
2. 在 `body` 區加入**預設插槽**（default slot），附帶備援文字
3. 在 `footer` 區加入**具名插槽** `name="footer"`，附帶備援文字

## 驗收標準
- [ ] `<slot name="header">預設標題</slot>` 出現在 `.card-header` 中
- [ ] `<slot>（此處可插入任意內容）</slot>` 出現在 `.card-body` 中
- [ ] `<slot name="footer">預設頁尾</slot>` 出現在 `.card-footer` 中
- [ ] 未傳入 slot 內容時，備援文字正確顯示

## 提示
- `<slot>` = 預設插槽（default slot），父層用 `<template #default>` 或直接放子元素
- `<slot name="header">` = 具名插槽，父層用 `<template #header>`
- `<slot>` 標籤內的內容是**備援內容**（fallback），父層有傳入時會被覆蓋
