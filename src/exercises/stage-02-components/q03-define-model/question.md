# Q03 — defineModel（Component v-model）

## 對應官方文件
- 章節：Component v-model
- URL：https://vuejs.org/guide/components/v-model

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
你正在實作 `CustomToggle` 元件（美化版 checkbox），父層用 `v-model` 綁定到它。
當使用者點擊 toggle 時，元件需要更新 modelValue 並通知父層。

## 起手式說明
`Starter.vue` 中已有：
- Template UI（toggle 按鈕外觀）
- 父層使用示意（hardcoded ref 模擬）

請你完成：
1. 使用 `defineModel()` 取得雙向綁定的 ref
2. 在 template 中用 `isOn.value` 讀取狀態
3. 點擊時執行 `isOn.value = !isOn.value`

## 驗收標準
- [ ] `const isOn = defineModel({ type: Boolean, default: false })` 正確呼叫
- [ ] 點擊 toggle 後，狀態即時切換
- [ ] 「父層視角」的顯示與 toggle 同步更新
- [ ] 按鈕有 active/inactive 視覺區別

## 提示
- `defineModel()` 回傳一個**可讀寫的 ref**
- 讀取：`isOn.value`
- 寫入：`isOn.value = newValue`（自動觸發 `update:modelValue` 事件）
- Vue 3.4+ 才支援 `defineModel`
