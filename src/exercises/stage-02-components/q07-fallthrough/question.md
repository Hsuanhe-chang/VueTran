# Q07 — Fallthrough Attributes

## 對應官方文件
- 章節：Fallthrough Attributes
- URL：https://vuejs.org/guide/components/attrs

## 題型
找錯誤

## 難度
⭐⭐ 中級

## 題目說明
`CustomButton` 封裝了一個 `<button>`，但父層加的 `class`、`style`、`id` 等 attrs 預設會掉落到元件**最外層的 div**，而非內部的 `<button>`。

請找出問題並修正，讓 attrs 正確傳遞到真正的 `<button>` 元素。

## 起手式說明
`Starter.vue` 就是 `CustomButton` 元件本身，有以下問題：
- 外層有多餘的包裝 `<div>`，attrs 都掉到 div 上
- 沒有使用 `inheritAttrs: false` 阻止自動繼承
- 沒有用 `useAttrs()` 手動把 attrs 傳給 button

## 驗收標準
- [ ] 加入 `defineOptions({ inheritAttrs: false })` 禁止自動 fallthrough
- [ ] 使用 `useAttrs()` 取得 attrs 物件
- [ ] 在 `<button>` 上用 `v-bind="attrs"` 手動套用
- [ ] 父層傳的 class/style/id 出現在 button 而非 div 上

## 提示
- 預設情況下，attrs 自動套用到元件的**根元素**
- 若元件有多個根元素，或想手動控制 attrs 要套用在哪裡，需要 `inheritAttrs: false`
- `useAttrs()` 在 `<script setup>` 中取得 attrs 物件
- `v-bind="attrs"` 把整個 attrs 物件展開套用到元素
