# Q02 — defineEmits 事件宣告與觸發

## 對應官方文件
- 章節：Component Events
- URL：https://vuejs.org/guide/components/events

## 題型
從零撰寫

## 難度
⭐ 基礎

## 題目說明
你正在實作 `FeedbackWidget` 元件，讓使用者點擊 👍 或 👎 送出評價，並支援重置。

## 起手式說明
`Starter.vue` 中已有：
- 完整的 template UI（按鈕、狀態顯示）
- 追蹤本地狀態用的 `submitted` 和 `lastFeedback` ref

請你完成：
1. 使用 `defineEmits` 宣告兩個事件：`feedback` 和 `reset`
2. 實作 `sendFeedback(type)` — 更新本地狀態 + emit 事件
3. 實作 `resetFeedback()` — 重置狀態 + emit 事件

## 驗收標準
- [ ] `defineEmits` 正確宣告了 `feedback` 和 `reset`
- [ ] 點擊 👍 / 👎 後，顯示「已送出」狀態
- [ ] 顯示最後 emit 的事件名稱與 payload
- [ ] 點擊「重置」後回到初始狀態
- [ ] console 或事件記錄中可見 emit 被觸發

## 提示
- `const emit = defineEmits(['feedback', 'reset'])`
- 呼叫：`emit('feedback', 'positive')` 或 `emit('reset')`
- 本元件沒有真正的父層，所以 emit 的效果透過本地狀態模擬展示
