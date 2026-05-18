# Q05 — 自訂指令（Custom Directives）

## 對應官方文件
- 章節：Custom Directives
- URL：https://vuejs.org/guide/reusability/custom-directives

## 題型
從零撰寫

## 難度
⭐⭐ 中級

## 題目說明
在 Vue 3 中，`<script setup>` 內以 `v` 開頭的變數會自動被當作自訂指令使用。
實作兩個常用的自訂指令：

1. `v-focus`（無參數）
   - 元素掛載時（`mounted`）自動呼叫 `.focus()`，讓輸入框自動獲得焦點

2. `v-highlight`（帶參數）
   - 元素掛載時，將元素的背景色設為 `binding.value`（傳入的顏色字串）
   - 當指令的值更新時（`updated`），同步更新背景色

## 起手式說明
`Starter.vue` 中已有：
- `v-focus` 和 `v-highlight` 的使用示範（template 已完成）
- 兩個空的指令物件骨架

請你完成：
1. `vFocus`：實作 `mounted(el)` hook，呼叫 `el.focus()`
2. `vHighlight`：實作 `mounted(el, binding)` 和 `updated(el, binding)` hook，設定 `el.style.backgroundColor`

## 驗收標準
- [ ] 頁面載入後，第一個輸入框自動獲得焦點
- [ ] 帶有 `v-highlight` 的元素背景色正確顯示
- [ ] 改變顏色後，背景色即時更新（updated hook 觸發）
- [ ] 指令在 `<script setup>` 中宣告（以 `v` 開頭命名），不需 `app.directive()` 全域註冊

## 提示
- `mounted(el) { el.focus() }` — 元素加入 DOM 後自動聚焦
- `binding.value` — 指令傳入的值（如 `v-highlight="'#fef9c3'"` 中的 `'#fef9c3'`）
- `el.style.backgroundColor = binding.value` — 設定背景色
- `updated` hook 在元件重新渲染後執行，確保動態顏色值可以更新
