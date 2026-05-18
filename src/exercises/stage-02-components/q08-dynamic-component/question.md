# Q08 — 動態元件（component :is）

## 對應官方文件
- 章節：Dynamic Components
- URL：https://vuejs.org/guide/essentials/component-basics#dynamic-components

## 題型
填空

## 難度
⭐⭐ 中級

## 題目說明
你正在實作一個 Tab 切換系統，根據使用者點擊的 Tab，動態渲染對應的子元件。

## 起手式說明
`Starter.vue` 中已有：
- 三個 Tab 元件定義（`TabHome`、`TabProfile`、`TabSettings`）
- Tab 按鈕列（已完成）
- `activeTab` ref 追蹤目前選中的 Tab
- 內容區的 TODO 待填入

請你完成：
1. 在內容區用 `<component :is="activeTab">` 動態渲染目前選中的 Tab
2. （進階）用 `<KeepAlive>` 包裹，讓切換時保留各 Tab 的狀態

## 驗收標準
- [ ] 點擊不同 Tab 後，內容區切換到對應元件
- [ ] `<component :is="activeTab">` 語法正確
- [ ] activeTab 的值為元件物件（非字串）

## 提示
- `:is` 可接受：元件物件（import 進來的）、元件名稱字串（全域註冊）
- 用元件物件比字串安全（不需要全域註冊，且有型別追蹤）
- `<KeepAlive>` 讓動態元件切換時不銷毀，保留其狀態（如 input 值）
