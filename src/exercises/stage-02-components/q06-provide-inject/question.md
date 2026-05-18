# Q06 — Provide / Inject 依賴注入

## 對應官方文件
- 章節：Provide / Inject
- URL：https://vuejs.org/guide/components/provide-inject

## 題型
填空 + 找錯誤

## 難度
⭐⭐ 中級

## 題目說明
你正在實作一個主題系統（light / dark）。父層提供主題資料，深層子元件透過 inject 取得，不需要一層一層 props 傳遞。

## 起手式說明
`Starter.vue`（父層）中已有：
- `currentTheme` ref 和 `toggleTheme` 函式
- `_ThemedCard.vue` 已匯入，會顯示 inject 到的主題

請你完成：
1. Part A：在 Starter.vue 中填入正確的 `provide()` 呼叫（提供 theme 和 toggleTheme）
2. Part B：找出以下兩段程式碼的錯誤並說明

## 驗收標準
- [ ] `provide('theme', currentTheme)` 正確（響應式 ref，不是 .value）
- [ ] `provide('toggleTheme', toggleTheme)` 正確
- [ ] 點擊「切換主題」按鈕後，ThemedCard 的外觀跟著改變
- [ ] 正確指出 Bug 1：provide 傳入 .value（非響應式）
- [ ] 正確指出 Bug 2：inject key 與 provide key 不一致

## 提示
- `provide(key, value)` — value 應傳入 ref 本身，不是 `.value`（才能保持響應性）
- `inject(key, defaultValue)` — 如果父層沒有 provide，使用 defaultValue
- Provide/Inject 適合避免「prop drilling」（跨多層傳遞 props）
