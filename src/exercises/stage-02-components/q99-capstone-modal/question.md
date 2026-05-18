# Q99 — 綜合題：可配置 Modal 系統

## 對應官方文件
- 章節：Props / Emits / Slots / Provide-Inject / Teleport
- URL：https://vuejs.org/guide/components/slots

## 題型
功能實作

## 難度
⭐⭐⭐ 進階

## 題目說明
從零實作一個 Modal 系統，包含：
1. `AppModal` 元件：透過 slot 讓父層自訂標題與內容
2. 開關狀態由父層管理（props + emit 或 defineModel）
3. 點擊背景或關閉按鈕可關閉 Modal
4. 使用 `<Teleport to="body">` 讓 Modal 渲染在 body 最底部（避免 z-index 問題）

## 起手式說明
`Starter.vue` 中已有：
- 使用示意的外框 UI（觸發按鈕）
- `showModal` ref 和示意資料

請你完成：
1. 實作 `AppModal` 元件（slots + emit + Teleport）
2. 在 Starter.vue 中使用 AppModal

## 驗收標準
- [ ] 點擊「開啟 Modal」按鈕後，Modal 出現
- [ ] Modal 有標題插槽（header slot）和內容插槽（default slot）
- [ ] 點擊關閉按鈕或背景後，Modal 消失
- [ ] Modal 使用 Teleport 渲染到 body
- [ ] Modal 出現/消失有 CSS transition 動畫（加分項）

## 提示
- `<Teleport to="body">` 讓元件渲染到 `<body>` 的最後，避免父層的 overflow/z-index 影響
- Modal 的開關可以用 `defineModel` 或 `v-model` 搭配 props + emit
- `v-if` vs `v-show`：Modal 建議用 `v-if`，避免 DOM 殘留；也可用 `v-show` + transition
