# Q01 — Composable 函式設計原則

## 對應官方文件
- 章節：Composables
- URL：https://vuejs.org/guide/reusability/composables

## 題型
填空 + 重構

## 難度
⭐⭐ 中級

## 題目說明
學習如何將元件內的邏輯提取為可複用的 Composable 函式。

## 起手式說明
`Starter.vue` 中有兩個部分：
- **Part A（填空）**：`useCounter` composable 骨架，補全缺少的邏輯
- **Part B（重構識別）**：一段違反 composable 原則的程式碼，指出問題所在

請你完成：
1. 補全 `useCounter` 的 `increment`、`decrement`、`reset` 函式
2. 找出 Part B 中 3 個違反 composable 原則的問題

## 驗收標準
- [ ] `useCounter` 回傳 `{ count, increment, decrement, reset }`
- [ ] 點擊按鈕後，計數器正確增減
- [ ] 指出 Bug 1：全域可變狀態（非響應式 ref）
- [ ] 指出 Bug 2：函式名稱不以 `use` 開頭
- [ ] 指出 Bug 3：直接操作 DOM（違反 Vue 響應式原則）

## 提示
- Composable 約定：函式名稱以 `use` 開頭（如 `useCounter`、`useFetch`）
- 狀態必須在函式內部用 `ref` / `reactive` 建立（不能用外部全域變數）
- 副作用（DOM操作、定時器等）應在 lifecycle hooks 中進行
- Composable 回傳響應式狀態，讓呼叫方可解構並保持響應性
